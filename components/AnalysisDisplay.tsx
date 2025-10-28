import React from 'react';
import type { AnalysisResult } from '../types';
import Loader from './Loader';

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const AnalysisCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className="bg-blue-500/10 p-2 rounded-lg">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
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
      <span className={`text-4xl font-bold ${getColor(score)}`}>{score}</span>
    </div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, isLoading, error }) => {
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5 0-2.269-2.269" />
            </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">Analysis Report</h3>
        <p className="mt-2 text-gray-400">Your resume analysis will appear here once completed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Overall Score</h3>
          <ScoreCircle score={result.overallScore} />
        </div>
        <AnalysisCard title="AI Summary" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
          <p>{result.summary}</p>
        </AnalysisCard>
      </div>
      
      <AnalysisCard title="Strengths" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.7 5.4a2 2 0 00.384 2.318l3.6 3.6m7-10h-7" /></svg>}>
        <ul className="list-disc list-inside space-y-2">
            {result.strengths.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </AnalysisCard>

      <AnalysisCard title="Areas for Improvement" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
        <ul className="list-disc list-inside space-y-2">
            {result.areasForImprovement.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      {/* FIX: Corrected typo in closing tag from AanalysisCard to AnalysisCard */}
      </AnalysisCard>
      
      <AnalysisCard title="Suggested Keywords" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}>
        <div className="flex flex-wrap gap-2">
          {result.suggestedKeywords.map((keyword, index) => (
            <span key={index} className="bg-gray-700 text-gray-200 text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
          ))}
        </div>
      </AnalysisCard>

      <AnalysisCard title="Formatting Feedback" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>
        <p>{result.formattingFeedback}</p>
      {/* FIX: Corrected typo in closing tag from AanalysisCard to AnalysisCard */}
      </AnalysisCard>
    </div>
  );
};

export default AnalysisDisplay;