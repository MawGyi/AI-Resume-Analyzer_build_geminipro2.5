import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-3 bg-gray-800/50 rounded-full px-4 py-2 border border-white/10">
        <SparklesIcon className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
          AI Resume Analyzer
        </h1>
      </div>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
        Paste your resume below or upload a .txt, .md, or .pdf file. Our AI will provide instant feedback to help you stand out.
      </p>
    </header>
  );
};

export default Header;