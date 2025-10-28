
import React, { useState } from 'react';
import type { MatchResult } from '../types';
import Loader from './Loader';
import ClipboardIcon from './icons/ClipboardIcon';

// Shared components for consistent styling
const AnalysisCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; actions?: React.ReactNode }> = ({ title, children, icon, actions }) => (
  <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
    <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (s: number) => {
    if (s < 50) return 'text-red-400';
    if (s < 80) return 'text-yellow-400';
    return 'text-green-400';
  };
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
       <svg className="absolute w-full h-full transform -rotate-90">
         <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50%"
            cy="50%"
        />
        <circle
            className={getColor(score)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50%"
            cy="50%"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={`text-4xl font-bold ${getColor(score)}`}>{score}</span>
        <span className="text-sm font-medium text-gray-400">% Match</span>
      </div>
    </div>
  );
};

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


interface MatchDisplayProps {
  result: MatchResult | null;
  isLoading: boolean;
  error: string | null;
}

const MatchDisplay: React.FC<MatchDisplayProps> = ({ result, isLoading, error }) => {
    const [isKeywordsCopied, setIsKeywordsCopied] = useState(false);

    const handleCopyKeywords = async () => {
        if (!result?.keywords_found || result.keywords_found.length === 0) return;
        const keywordsText = result.keywords_found.join(', ');
        try {
            await navigator.clipboard.writeText(keywordsText);
            setIsKeywordsCopied(true);
            setTimeout(() => setIsKeywordsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-red-500/50 text-center">
                <div className="w-12 h-12 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Analysis Error</h3>
                <p className="mt-2 text-red-300">{error}</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                <div className="w-12 h-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Job Match Report</h3>
                <p className="mt-2 text-gray-400">Your resume vs. job description analysis will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Match Score</h3>
                    <ScoreCircle score={result.match_score} />
                </div>
                <AnalysisCard title="Match Summary" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                    <p>{result.match_summary}</p>
                </AnalysisCard>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <AnalysisCard 
                    title="Keywords Found" 
                    icon={<CheckIcon className="h-6 w-6" />}
                    actions={
                        result.keywords_found.length > 0 ? (
                            <button
                                onClick={handleCopyKeywords}
                                className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                aria-label="Copy found keywords to clipboard"
                            >
                                {isKeywordsCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-gray-400" />}
                            </button>
                        ) : null
                    }
                 >
                    <div className="flex flex-wrap gap-2">
                        {result.keywords_found.length > 0 ? result.keywords_found.map((keyword, index) => (
                            <span key={index} className="bg-green-800/50 text-green-200 text-xs font-medium px-2.5 py-1 rounded-full border border-green-500/50">{keyword}</span>
                        )) : <p className="text-gray-400 text-sm">No major keywords found.</p>}
                    </div>
                </AnalysisCard>
                <AnalysisCard title="Keywords Missing" icon={<XIcon />}>
                     <div className="flex flex-wrap gap-2">
                         {result.keywords_missing.length > 0 ? result.keywords_missing.map((keyword, index) => (
                             <span key={index} className="bg-red-800/50 text-red-200 text-xs font-medium px-2.5 py-1 rounded-full border border-red-500/50">{keyword}</span>
                        )) : <p className="text-gray-400 text-sm">No critical keywords missing!</p>}
                    </div>
                </AnalysisCard>
            </div>

            <AnalysisCard title="Experience Gap Analysis" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                <p>{result.experience_gap}</p>
            </AnalysisCard>
        </div>
    );
};

export default MatchDisplay;
