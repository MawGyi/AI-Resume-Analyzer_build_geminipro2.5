
import React, { useState } from 'react';
import type { RewriteResult } from '../types';
import Loader from './Loader';
import SparklesIcon from './icons/SparklesIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface RewriteDisplayProps {
  result: RewriteResult | null;
  isLoading: boolean;
  error: string | null;
}

const RewriteCard: React.FC<{ text: string }> = ({ text }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optionally show an error state
        }
    };

    return (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-start gap-4 transition-all hover:bg-white/10">
            <div className="flex-shrink-0 text-blue-400 mt-1">
                <SparklesIcon className="w-5 h-5" />
            </div>
            <p className="flex-grow text-gray-300">{text}</p>
            <button
                onClick={handleCopy}
                className="flex-shrink-0 p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Copy to clipboard"
            >
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-gray-400" />}
            </button>
        </div>
    );
}

const RewriteDisplay: React.FC<RewriteDisplayProps> = ({ result, isLoading, error }) => {
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
                <h3 className="mt-4 text-xl font-semibold text-white">Rewrite Error</h3>
                <p className="mt-2 text-red-300">{error}</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                <div className="w-12 h-12 text-gray-500">
                    <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Bullet Point Rewriter</h3>
                <p className="mt-2 text-gray-400">Your rewritten bullet point suggestions will appear here.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                        <SparklesIcon className="h-6 w-6 text-blue-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100">Generated Variations</h3>
                </div>
                <div className="space-y-3">
                    {result.map((bullet, index) => (
                       <RewriteCard key={index} text={bullet} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RewriteDisplay;
