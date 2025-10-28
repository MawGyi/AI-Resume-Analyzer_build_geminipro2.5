
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-white/10 text-center">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <h3 className="mt-6 text-xl font-semibold text-white">Analyzing Your Resume...</h3>
      <p className="mt-2 text-gray-400">The AI is working its magic. This might take a moment.</p>
    </div>
  );
};

export default Loader;
