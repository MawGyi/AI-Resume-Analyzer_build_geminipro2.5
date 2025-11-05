
import React from 'react';
import UndoIcon from './icons/UndoIcon';
import RedoIcon from './icons/RedoIcon';

interface JobDescriptionInputProps {
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  disabled: boolean;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ jobDescriptionText, setJobDescriptionText, disabled, undo, redo, canUndo, canRedo }) => {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-8">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="job-description-text" className="text-lg font-semibold text-gray-200">
          Job Description
        </label>
         <div className="flex items-center gap-2">
           <button
              onClick={undo}
              disabled={!canUndo || disabled}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
              aria-label="Undo"
          >
              <UndoIcon className="w-5 h-5" />
          </button>
          <button
              onClick={redo}
              disabled={!canRedo || disabled}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
              aria-label="Redo"
          >
              <RedoIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <textarea
        id="job-description-text"
        value={jobDescriptionText}
        onChange={(e) => setJobDescriptionText(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full h-48 bg-gray-800/50 text-gray-300 p-4 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-y"
        disabled={disabled}
      />
    </div>
  );
};

export default JobDescriptionInput;
