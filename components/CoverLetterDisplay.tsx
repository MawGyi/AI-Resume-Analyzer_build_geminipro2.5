
import React, { useState } from 'react';
import type { CoverLetterResult } from '../types';
import Loader from './Loader';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface CoverLetterDisplayProps {
  result: CoverLetterResult | null;
  isLoading: boolean;
  error: string | null;
}

const CoverLetterDisplay: React.FC<CoverLetterDisplayProps> = ({ result, isLoading, error }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
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
                <h3 className="mt-4 text-xl font-semibold text-white">Generation Error</h3>
                <p className="mt-2 text-red-300">{error}</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                <div className="w-12 h-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Cover Letter Generator</h3>
                <p className="mt-2 text-gray-400">Your generated cover letter will appear here.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm relative">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-md bg-gray-800/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label="Copy to clipboard"
                    >
                        {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-gray-400" />}
                    </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-300">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                       </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100">Your Generated Cover Letter</h3>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap font-serif leading-relaxed prose prose-invert prose-p:text-gray-300">
                    {result}
                </div>
            </div>
        </div>
    );
};

export default CoverLetterDisplay;
