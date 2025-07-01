
import React, { useState, useCallback } from 'react';
import { researchKeywords, isApiKeyMissing, MISSING_KEY_ERROR } from '../../services/geminiService';
import { KeywordSuggestion } from '../../types';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { Tooltip } from '../ui/Tooltip';

const DifficultyIndicator: React.FC<{ difficulty: number }> = ({ difficulty }) => {
    const getBarColor = (d: number) => {
        if (d < 30) return 'bg-green-500';
        if (d < 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
            <div className={`${getBarColor(difficulty)} h-2 rounded-full`} style={{ width: `${difficulty}%` }}></div>
        </div>
    );
};

const KeywordsTab: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [suggestions, setSuggestions] = useState<KeywordSuggestion[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResearch = useCallback(async () => {
        if (!topic.trim()) {
            setError('Please enter a topic to research.');
            return;
        }
        if (isApiKeyMissing()) {
            setError(MISSING_KEY_ERROR);
            return;
        }

        setIsLoading(true);
        setError('');
        setSuggestions(null);

        const result = await researchKeywords(topic);
        if (result) {
            setSuggestions(result);
        } else {
            setError('Failed to get keyword suggestions. The AI may have returned an invalid format or the service may be unavailable.');
        }
        setIsLoading(false);
    }, [topic]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <label htmlFor="keyword-topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                <input
                    type="text"
                    id="keyword-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., renewable energy sources"
                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
            </div>

            <Button onClick={handleResearch} disabled={isLoading} className="w-full">
                {isLoading ? <Spinner /> : <><Icon name="search" className="w-5 h-5 mr-2"/>Research Keywords</>}
            </Button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <Spinner size="lg"/>
                    <p className="text-slate-500 dark:text-slate-400 animate-pulse">Researching keywords...</p>
                </div>
            )}

            {suggestions && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">Keyword Suggestions</h3>
                        <Tooltip content={
                            <div className="text-left">
                                <h5 className="font-bold mb-1">Search Volume</h5>
                                <p className="mb-2 text-slate-300">An estimate of how many times a keyword is searched for per month. 'High' indicates strong popularity.</p>
                                <h5 className="font-bold mb-1">Difficulty</h5>
                                <p className="text-slate-300">An estimate of how hard it is to rank in the top 10 search results for this keyword. Higher numbers (closer to 100) are more difficult.</p>
                            </div>
                        }>
                            <Icon name="info" className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200" />
                        </Tooltip>
                    </div>
                    {suggestions.map((s, index) => (
                        <Card key={index}>
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-blue-600 dark:text-blue-400">{s.keyword}</h4>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    s.volume === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    s.volume === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>{s.volume}</span>
                            </div>
                            <div className="mt-3">
                                <span className="text-xs text-slate-500 dark:text-slate-400">Difficulty: {s.difficulty}/100</span>
                                <DifficultyIndicator difficulty={s.difficulty} />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KeywordsTab;
