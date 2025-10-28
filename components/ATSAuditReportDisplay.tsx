
import React from 'react';
import type { ATSAuditResult } from '../types';

interface ATSAuditReportDisplayProps {
  result: ATSAuditResult | null;
  isLoading: boolean;
  error: string | null;
}

const QualityBadge: React.FC<{ quality: 'Excellent' | 'Good' | 'Poor' }> = ({ quality }) => {
  const baseClasses = 'px-3 py-1 text-sm font-bold rounded-full';
  const qualityMap = {
    Excellent: { text: 'Excellent', classes: 'bg-green-500/20 text-green-300 border border-green-500/50' },
    Good: { text: 'Good', classes: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' },
    Poor: { text: 'Poor', classes: 'bg-red-500/20 text-red-300 border border-red-500/50' },
  };
  const { text, classes } = qualityMap[quality];
  return <span className={`${baseClasses} ${classes}`}>{text}</span>;
};


const ATSAuditReportDisplay: React.FC<ATSAuditReportDisplayProps> = ({ result, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Auditing ATS parse quality...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/5 p-6 rounded-xl border border-red-500/50 text-center">
                <div className="mx-auto w-12 h-12 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Audit Error</h3>
                <p className="mt-2 text-red-300">{error}</p>
            </div>
        );
    }
    
    if (!result) {
        return null; // Don't show anything if there's no result and not loading/error
    }
    
    return (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-100">ATS Parse Quality Report</h3>
                    <p className="text-gray-400">{result.summary_feedback}</p>
                </div>
                <QualityBadge quality={result.parse_quality} />
            </div>

            {result.critical_errors.length > 0 && (
                <div>
                    <h4 className="font-semibold text-red-300 mb-2">Critical Errors Found:</h4>
                    <ul className="space-y-2 list-disc list-inside text-red-200/90 bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                        {result.critical_errors.map((err, index) => (
                            <li key={index}>
                                <strong className="font-semibold">{err.field}:</strong> {err.issue}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <h4 className="font-semibold text-green-300 mb-2">Action Recommendation:</h4>
                <p className="text-gray-300 bg-green-900/20 p-4 rounded-lg border border-green-500/30">{result.action_recommendation}</p>
            </div>
        </div>
    );
};

export default ATSAuditReportDisplay;
