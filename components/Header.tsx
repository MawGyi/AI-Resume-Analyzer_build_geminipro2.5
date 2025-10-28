
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
      <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
        Get AI-powered feedback on your resume, match it to a job, rewrite bullet points, generate a cover letter, see how an ATS parses it and audit the quality, or create custom interview questions.
      </p>
    </header>
  );
};

export default Header;
