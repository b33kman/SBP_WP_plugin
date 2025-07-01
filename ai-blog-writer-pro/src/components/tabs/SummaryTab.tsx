
import React, { useState, useCallback } from 'react';
import { summarizePost, isApiKeyMissing, MISSING_KEY_ERROR } from '../../services/geminiService';
import { SummaryReport } from '../../types';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';

interface SummaryTabProps {
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


const SummaryTab: React.FC<SummaryTabProps> = ({ postContent }) => {
    const [report, setReport] = useState<SummaryReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        if (!postContent.trim()) {
            setError('There is no content to summarize.');
            return;
        }
        if (isApiKeyMissing()) {
            setError(MISSING_KEY_ERROR);
            return;
        }
        
        setIsLoading(true);
        setError('');
        setReport(null);

        const result = await summarizePost(postContent);
        if (result) {
            setReport(result);
        } else {
            setError('Failed to get summary. The AI may have returned an invalid format or the service may be unavailable.');
        }
        setIsLoading(false);
    }, [postContent]);

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center">
                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Get a high-level summary of your post's structure, SEO, and readability.
                </p>
            </div>
            
            <Button onClick={handleAnalyze} disabled={isLoading || !postContent.trim()} className="w-full">
                {isLoading ? <Spinner /> : <><Icon name="search" className="w-5 h-5 mr-2"/>Generate Summary</>}
            </Button>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <Spinner size="lg"/>
                    <p className="text-slate-500 dark:text-slate-400 animate-pulse">Analyzing post...</p>
                </div>
            )}

            {report && (
                <div className="flex flex-col gap-4">
                    <Card>
                        <h4 className="font-bold text-lg">Overall Summary</h4>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-center">
                            <div>
                                <p className="text-2xl font-bold">{report.wordCount}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Words</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold">{report.structure.h2}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Sections (H2s)</p>
                            </div>
                             <div>
                                <p className="text-lg font-bold capitalize">{report.tone}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Tone</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="font-bold">SEO Score</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <ScoreIndicator score={report.seoScore} />
                           <span className="font-bold text-sm">{report.seoScore}/100</span>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="font-bold">Readability</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{report.readability.feedback}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <ScoreIndicator score={report.readability.score} />
                           <span className="font-bold text-sm">{report.readability.score}/100</span>
                        </div>
                    </Card>
                    
                    <Card>
                        <h4 className="font-bold">Keywords</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {report.keywords.length > 0 ? report.keywords.map(k => (
                                <span key={k.keyword} className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {k.keyword} ({k.frequency})
                                </span>
                            )) : <p className="text-xs text-slate-500 dark:text-slate-400">No distinct keywords identified.</p>}
                        </div>
                    </Card>

                    <Card>
                        <h4 className="font-bold">Actionable Insights</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                             {report.actionableInsights.map((insight, i) => (
                                <li key={i}>{insight}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SummaryTab;
