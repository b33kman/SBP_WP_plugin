
export enum TabId {
  CONTENT = 'content',
  SEO = 'seo',
  KEYWORDS = 'keywords',
  SUMMARY = 'summary',
}

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

export enum CreativityLevel {
  FOCUSED = 'Focused',
  BALANCED = 'Balanced',
  CREATIVE = 'Creative',
}

export enum ContentType {
  TITLE = 'Title Suggestions',
  OUTLINE = 'Blog Post Outline',
  INTRO = 'Introduction Paragraph',
  FULL_POST = 'Full Blog Post',
}

export interface SEOReport {
  title: {
    score: number;
    suggestion: string;
    feedback: string;
  };
  metaDescription: {
    score: number;
    suggestion: string;
    feedback: string;
  };
  readability: {
    score: number;
    feedback: string;
  };
  keywordDensity: {
      score: number;
      feedback: string;
  };
}

export interface KeywordSuggestion {
    keyword: string;
    volume: string;
    difficulty: number;
}

export interface SummaryReport {
  seoScore: number;
  keywords: { keyword: string; frequency: number }[];
  readability: { score: number; feedback: string; };
  structure: { h1: number; h2: number; h3: number; };
  wordCount: number;
  tone: string;
  actionableInsights: string[];
}
