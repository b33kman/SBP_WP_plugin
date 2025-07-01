
import React, { useState, useCallback } from 'react';
import { generateContent, isApiKeyMissing, MISSING_KEY_ERROR } from '../../services/geminiService';
import { ContentType, CreativityLevel } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';
import { Spinner } from '../ui/Spinner';
import { Icon } from '../ui/Icon';
import { marked } from 'marked';

interface ContentGenerationTabProps {
    onAcceptContent: (content: string) => void;
}

const ContentGenerationTab: React.FC<ContentGenerationTabProps> = ({ onAcceptContent }) => {
    const [topic, setTopic] = useState('');
    const [contentType, setContentType] = useState<ContentType>(ContentType.INTRO);
    const [creativity, setCreativity] = useState<CreativityLevel>(CreativityLevel.BALANCED);
    const [wordCount, setWordCount] = useState(1000);
    const [keywords, setKeywords] = useState('');
    const [keywordDensity, setKeywordDensity] = useState(1.0);
    const [numSections, setNumSections] = useState(4);
    const [numParagraphs, setNumParagraphs] = useState(3);
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Please enter a topic or instruction.');
            return;
        }
        if (isApiKeyMissing()) {
            setError(MISSING_KEY_ERROR);
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedContent('');

        const options = {
            wordCount,
            keywords,
            keywordDensity,
            numSections,
            numParagraphs,
        };

        const result = await generateContent(topic, contentType, creativity, options);
        if (result.includes('An error occurred') || result.includes('service is unavailable')) {
            setError(result);
        } else {
            setGeneratedContent(result);
        }
        setIsLoading(false);
    }, [topic, contentType, creativity, wordCount, keywords, keywordDensity, numSections, numParagraphs]);

    const creativityToValue = (level: CreativityLevel): number => {
        if (level === CreativityLevel.FOCUSED) return 0;
        if (level === CreativityLevel.BALANCED) return 1;
        return 2;
    }

    const valueToCreativity = (value: number): CreativityLevel => {
        if (value === 0) return CreativityLevel.FOCUSED;
        if (value === 1) return CreativityLevel.BALANCED;
        return CreativityLevel.CREATIVE;
    }

    const getPreviewHtml = () => {
        try {
            // Use marked to parse markdown content. Cast to string is safe here.
            return { __html: marked.parse(generatedContent) as string };
        } catch (e) {
            console.error("Markdown parsing failed", e);
             // Fallback for any parsing error
            return { __html: generatedContent.replace(/\n/g, '<br />') };
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic / Instruction</label>
                    <textarea
                        id="topic"
                        rows={3}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The benefits of remote work for small businesses"
                    />
                </div>
                <div>
                    <label htmlFor="contentType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content Type</label>
                    <Select
                        id="contentType"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value as ContentType)}
                        options={Object.values(ContentType)}
                    />
                </div>
                <div>
                    <label htmlFor="creativity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Creativity: <span className="font-bold text-blue-600 dark:text-blue-400">{creativity}</span></label>
                    <Slider
                        id="creativity"
                        min={0}
                        max={2}
                        step={1}
                        value={creativityToValue(creativity)}
                        onChange={(e) => setCreativity(valueToCreativity(parseInt(e.target.value)))}
                    />
                </div>
                {contentType === ContentType.FULL_POST && (
                    <>
                        <div>
                           <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keyword(s) Focus (optional, comma-separated)</label>
                           <input
                                id="keywords"
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g., remote work, productivity, small business"
                                className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                           />
                        </div>
                         <div>
                            <label htmlFor="keywordDensity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keyword Density Target: <span className="font-bold text-blue-600 dark:text-blue-400">{keywordDensity.toFixed(1)}%</span></label>
                            <Slider
                                id="keywordDensity"
                                min={0}
                                max={2}
                                step={0.1}
                                value={keywordDensity}
                                onChange={(e) => setKeywordDensity(parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="numSections" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sections (per post): <span className="font-bold text-blue-600 dark:text-blue-400">{numSections}</span></label>
                            <Slider
                                id="numSections"
                                min={1}
                                max={6}
                                step={1}
                                value={numSections}
                                onChange={(e) => setNumSections(parseInt(e.target.value))}
                            />
                        </div>
                         <div>
                            <label htmlFor="numParagraphs" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paragraphs (per section): <span className="font-bold text-blue-600 dark:text-blue-400">{numParagraphs}</span></label>
                            <Slider
                                id="numParagraphs"
                                min={1}
                                max={4}
                                step={1}
                                value={numParagraphs}
                                onChange={(e) => setNumParagraphs(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="wordCount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Word Count: <span className="font-bold text-blue-600 dark:text-blue-400">{wordCount}</span></label>
                            <Slider
                                id="wordCount"
                                min={100}
                                max={2000}
                                step={50}
                                value={wordCount}
                                onChange={(e) => setWordCount(parseInt(e.target.value))}
                            />
                        </div>
                    </>
                )}
            </div>

            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? <Spinner /> : <><Icon name="sparkles" className="w-5 h-5 mr-2"/>Generate</>}
            </Button>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {generatedContent && (
                <div className="flex-grow flex flex-col gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Generated Content Preview</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none flex-grow overflow-y-auto p-2 bg-slate-50 dark:bg-slate-700/50 rounded"
                        dangerouslySetInnerHTML={getPreviewHtml()}
                    >
                    </div>
                    <div className="flex gap-4 mt-2">
                        <Button onClick={() => onAcceptContent(generatedContent)} variant="primary" className="flex-1">
                            <Icon name="check" className="w-5 h-5 mr-2"/> Accept
                        </Button>
                        <Button onClick={handleGenerate} variant="secondary" className="flex-1">
                             <Icon name="refresh" className="w-5 h-5 mr-2"/> Regenerate
                        </Button>
                    </div>
                </div>
            )}
            {isLoading && !generatedContent && (
                 <div className="flex flex-col items-center justify-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 flex-grow">
                    <Spinner size="lg"/>
                    <p className="text-slate-500 dark:text-slate-400 animate-pulse">Generating content...</p>
                </div>
            )}
        </div>
    );
};

export default ContentGenerationTab;
