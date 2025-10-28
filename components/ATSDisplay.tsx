
import React, { useState } from 'react';
import type { ATSResult, ATSAuditResult } from '../types';
import Loader from './Loader';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import ATSAuditReportDisplay from './ATSAuditReportDisplay';

interface ATSDisplayProps {
  result: ATSResult | null;
  isLoading: boolean;
  error: string | null;
  onAudit: () => void;
  auditResult: ATSAuditResult | null;
  isAuditing: boolean;
  auditError: string | null;
}

const ATSDisplay: React.FC<ATSDisplayProps> = ({ result, isLoading, error, onAudit, auditResult, isAuditing, auditError }) => {
    const [isCopied, setIsCopied] = useState(false);

    const formattedJson = result ? JSON.stringify(result, null, 2) : '';

    const handleCopy = async () => {
        if (!formattedJson) return;
        try {
            await navigator.clipboard.writeText(formattedJson);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy JSON: ', err);
        }
    };

    const syntaxHighlight = (jsonString: string) => {
        if (!jsonString) return '';
        const escapedString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return escapedString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-green-300'; // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-pink-400'; // key
                } else {
                    cls = 'text-yellow-300'; // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-purple-400'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-gray-500'; // null
            }
            return `<span class="${cls}">${match}</span>`;
        });
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
                <h3 className="mt-4 text-xl font-semibold text-white">Parsing Error</h3>
                <p className="mt-2 text-red-300">{error}</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                <div className="w-12 h-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                    </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">ATS Parser</h3>
                <p className="mt-2 text-gray-400">See how an Applicant Tracking System reads your resume. The parsed data will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-gray-900/70 p-6 rounded-xl border border-white/10 backdrop-blur-sm relative font-mono text-sm">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-md bg-gray-800/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label="Copy JSON to clipboard"
                    >
                        {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-gray-400" />}
                    </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-300">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                       </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 font-sans">ATS Parsed Data</h3>
                </div>
                <pre className="whitespace-pre-wrap break-all">
                    <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(formattedJson) }} />
                </pre>
            </div>
             <div className="flex justify-center">
                <button
                    onClick={onAudit}
                    disabled={isAuditing}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300"
                    >
                    {isAuditing ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Auditing...
                        </>
                    ) : (
                        'Audit Parse Quality'
                    )}
                </button>
            </div>

            <ATSAuditReportDisplay 
                result={auditResult}
                isLoading={isAuditing}
                error={auditError}
            />
        </div>
    );
};

export default ATSDisplay;
