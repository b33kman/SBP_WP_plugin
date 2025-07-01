
import { ContentType, CreativityLevel, SEOReport, KeywordSuggestion, SummaryReport } from '../types';

// Data passed from PHP via wp_localize_script
declare const aibwp_data: {
    api_url: string;
    nonce: string;
    is_api_key_set: boolean;
};

const MISSING_KEY_ERROR = "AI service is unavailable. Please ensure the API Key is configured in the plugin settings.";
const GENERAL_ERROR = "An error occurred. Please check the browser console for more details.";

export const isApiKeyMissing = (): boolean => {
    return !aibwp_data?.is_api_key_set;
}

/**
 * A secure, generic function to call our backend REST API endpoint.
 * @param body The data to send to the backend.
 * @returns The JSON response from the backend.
 */
const secureApiFetch = async (body: Record<string, any>): Promise<any> => {
    try {
        const response = await fetch(`${aibwp_data.api_url}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': aibwp_data.nonce,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.message || 'API request failed');
        }

        const data = await response.json();
        // The backend wraps the AI's response in a 'text' property.
        return data.text;
    } catch (error) {
        console.error('Failed to fetch from backend API:', error);
        throw error;
    }
};

const parseJsonResponse = <T,>(text: string): T | null => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Original text:", text);
        return null;
    }
};

const getCreativitySettings = (level: CreativityLevel) => {
    switch (level) {
        case CreativityLevel.FOCUSED: return { temperature: 0.2, topP: 0.8 };
        case CreativityLevel.BALANCED: return { temperature: 0.7, topP: 0.9 };
        case CreativityLevel.CREATIVE: return { temperature: 1.0, topP: 0.95 };
    }
};

interface GenerationOptions {
    wordCount?: number;
    keywords?: string;
    keywordDensity?: number;
    numSections?: number;
    numParagraphs?: number;
}

// All public-facing functions are now refactored to use the secure backend fetcher.

export const generateContent = async (
    topic: string,
    contentType: ContentType,
    creativity: CreativityLevel,
    options: GenerationOptions = {}
): Promise<string> => {
    if (isApiKeyMissing()) return MISSING_KEY_ERROR;
    try {
        const generationConfig = getCreativitySettings(creativity);
        let prompt = '';

        // The prompt logic remains the same, as it defines the AI's task.
        switch (contentType) {
             case ContentType.TITLE:
                prompt = `Generate 5 compelling, SEO-friendly blog post titles for the topic: "${topic}". Keep titles under 60 characters.`;
                break;
            case ContentType.OUTLINE:
                prompt = `Create a detailed, SEO-optimized blog post outline for the topic: "${topic}". Include H2 and H3 headings.`;
                break;
            case ContentType.INTRO:
                prompt = `Write an engaging introduction paragraph for a blog post about "${topic}". Hook the reader in and state the post's purpose.`;
                break;
            case ContentType.FULL_POST:
                const { wordCount = 1000, keywords, keywordDensity, numSections, numParagraphs } = options;
                prompt = `Write a complete, well-structured, and SEO-optimized blog post on the topic: "${topic}". Use markdown for formatting. Aim for approximately ${wordCount} words. It must have exactly ${numSections} main sections (H2s). Each section should contain around ${numParagraphs} paragraphs. Focus on naturally incorporating these keywords: "${keywords}" with a target density of about ${keywordDensity}%.`;
                break;
        }

        return await secureApiFetch({ prompt, config: generationConfig });
    } catch (error) {
        return GENERAL_ERROR;
    }
};

export const analyzeSeo = async (content: string, keyword: string): Promise<SEOReport | null> => {
    if (isApiKeyMissing()) return null;
    if (!content.trim()) return null;
    
    try {
        const prompt = `Analyze the following blog post content for SEO optimization, focusing on the keyword "${keyword}". Content: --- ${content} --- Provide a detailed analysis and return the output as a single JSON object with the following structure: {"title": { "score": <0-100>, "suggestion": "<new title>", "feedback": "<detailed feedback>" }, "metaDescription": { "score": <0-100>, "suggestion": "<new meta>", "feedback": "<detailed feedback>" }, "readability": { "score": <0-100>, "feedback": "<detailed feedback>" }, "keywordDensity": { "score": <0-100>, "feedback": "<detailed feedback>" }}`;
        
        const responseText = await secureApiFetch({ prompt, config: { responseMimeType: "application/json" } });
        return parseJsonResponse<SEOReport>(responseText);
    } catch (error) {
        return null;
    }
};

export const researchKeywords = async (topic: string): Promise<KeywordSuggestion[] | null> => {
    if (isApiKeyMissing()) return null;
    try {
        const prompt = `Act as an SEO expert. For the topic "${topic}", generate a list of 10 related keywords. For each keyword, provide an estimated search volume (Low, Medium, High) and a difficulty score (0-100). Return the result as a single JSON array with this structure: [{"keyword": "<keyword>", "volume": "<Low/Medium/High>", "difficulty": <0-100>}, ...]`;

        const responseText = await secureApiFetch({ prompt, config: { responseMimeType: "application/json" } });
        return parseJsonResponse<KeywordSuggestion[]>(responseText);
    } catch (error) {
        return null;
    }
};

export const summarizePost = async (content: string): Promise<SummaryReport | null> => {
    if (isApiKeyMissing()) return null;
    if (!content.trim()) return null;
    try {
        const prompt = `Analyze the following blog post content. Return a single, well-formed JSON object with the exact structure specified: {"seoScore": <0-100>, "keywords": [{"keyword": "<string>", "frequency": <number>}], "readability": {"score": <0-100>, "feedback": "<string>"}, "structure": {"h1": <number>, "h2": <number>, "h3": <number>}, "wordCount": <number>, "tone": "<string>", "actionableInsights": ["<string>"]}. Content: --- ${content} ---`;

        const responseText = await secureApiFetch({ prompt, config: { responseMimeType: "application/json" } });
        return parseJsonResponse<SummaryReport>(responseText);
    } catch (error) {
        return null;
    }
};

export { MISSING_KEY_ERROR };
