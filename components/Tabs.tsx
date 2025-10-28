
import React from 'react';

type Mode = 'analysis' | 'match' | 'rewrite' | 'cover' | 'ats' | 'interview';

interface TabsProps {
  activeTab: Mode;
  setActiveTab: (tab: Mode) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const getTabClass = (tab: Mode) => {
    return activeTab === tab
      ? 'bg-blue-600 text-white'
      : 'text-gray-400 hover:bg-white/10 hover:text-white';
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-wrap justify-center gap-2 bg-gray-800/80 border border-white/10 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${getTabClass('analysis')}`}
          aria-pressed={activeTab === 'analysis'}
        >
          Resume Analysis
        </button>
        <button
          onClick={() => setActiveTab('match')}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${getTabClass('match')}`}
          aria-pressed={activeTab === 'match'}
        >
          Job Description Match
        </button>
        <button
          onClick={() => setActiveTab('rewrite')}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${getTabClass('rewrite')}`}
          aria-pressed={activeTab === 'rewrite'}
        >
          Bullet Point Rewriter
        </button>
        <button
          onClick={() => setActiveTab('cover')}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${getTabClass('cover')}`}
          aria-pressed={activeTab === 'cover'}
        >
          Cover Letter Generator
        </button>
        <button
          onClick={() => setActiveTab('ats')}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${getTabClass('ats')}`}
          aria-pressed={activeTab === 'ats'}
        >
          ATS Parser
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${getTabClass('interview')}`}
          aria-pressed={activeTab === 'interview'}
        >
          Interview Q's
        </button>
      </div>
    </div>
  );
};

export default Tabs;
