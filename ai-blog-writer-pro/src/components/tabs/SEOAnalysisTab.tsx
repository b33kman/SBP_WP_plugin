
import React, { useState, useCallback } from 'react';
import { analyzeSeo, isApiKeyMissing, MISSING_KEY_ERROR } from '../../services/geminiService';
import { SEOReport } from '../../types';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';

interface SEOAnalysisTabProps {
  postContent: string;
}

const ScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
    const getColor = (s: number) => {
        if (s < 50) return 'bg-red-500';
        if (s < 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };
    return (
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
            <div className={`${getColor(score)} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
        </div>
    );
};

const SEOAnalysisTab: React.FC<SEOAnalysisTabProps> = ({ postContent }) => {
    const [keyword, setKeyword] = useState('');
    const [report, setReport] = useState<SEOReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        if (!postContent.trim()) {
            setError('There is no content to analyze.');
            return;
        }
        if (!keyword.trim()) {
            setError('Please enter a focus keyword.');
            return;
        }
        if (isApiKeyMissing()) {
            setError(MISSING_KEY_ERROR);
            return;
        }

        setIsLoading(true);
        setError('');
        setReport(null);

        const result = await analyzeSeo(postContent, keyword);
        if (result) {
            setReport(result);
        } else {
            setError('Failed to get SEO analysis. The AI may have returned an invalid format or the service may be unavailable.');
        }
        setIsLoading(false);
    }, [postContent, keyword]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Focus Keyword</label>
                <input
                    type="text"
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g., content marketing"
                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
            </div>

            <Button onClick={handleAnalyze} disabled={isLoading || !postContent.trim()} className="w-full">
                {isLoading ? <Spinner /> : <><Icon name="search" className="w-5 h-5 mr-2"/>Analyze SEO</>}
            </Button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <Spinner size="lg"/>
                    <p className="text-slate-500 dark:text-slate-400 animate-pulse">Analyzing SEO...</p>
                </div>
            )}
            
            {report && (
                <div className="flex flex-col gap-4">
                    <Card>
                        <h4 className="font-bold">Title</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{report.title.feedback}</p>
                        <p className="text-xs mt-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">Suggestion: <span className="font-semibold">{report.title.suggestion}</span></p>
                        <div className="flex items-center gap-2 mt-2">
                           <ScoreIndicator score={report.title.score} />
                           <span className="font-bold text-sm">{report.title.score}</span>
                        </div>
                    </Card>
                     <Card>
                        <h4 className="font-bold">Meta Description</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{report.metaDescription.feedback}</p>
                        <p className="text-xs mt-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">Suggestion: <span className="font-semibold">{report.metaDescription.suggestion}</span></p>
                        <div className="flex items-center gap-2 mt-2">
                           <ScoreIndicator score={report.metaDescription.score} />
                           <span className="font-bold text-sm">{report.metaDescription.score}</span>
                        </div>
                    </Card>
                     <Card>
                        <h4 className="font-bold">Readability</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{report.readability.feedback}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <ScoreIndicator score={report.readability.score} />
                           <span className="font-bold text-sm">{report.readability.score}</span>
                        </div>
                    </Card>
                     <Card>
                        <h4 className="font-bold">Keyword Density</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{report.keywordDensity.feedback}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <ScoreIndicator score={report.keywordDensity.score} />
                           <span className="font-bold text-sm">{report.keywordDensity.score}</span>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SEOAnalysisTab;
