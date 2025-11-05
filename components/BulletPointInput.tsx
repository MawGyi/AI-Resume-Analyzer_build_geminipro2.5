
import React from 'react';
import UndoIcon from './icons/UndoIcon';
import RedoIcon from './icons/RedoIcon';

interface BulletPointInputProps {
  bulletPointText: string;
  setBulletPointText: (text: string) => void;
  missingKeywords: string;
  setMissingKeywords: (text: string) => void;
  disabled: boolean;
  undoBulletPoint: () => void;
  redoBulletPoint: () => void;
  canUndoBulletPoint: boolean;
  canRedoBulletPoint: boolean;
  undoMissingKeywords: () => void;
  redoMissingKeywords: () => void;
  canUndoMissingKeywords: boolean;
  canRedoMissingKeywords: boolean;
}

const BulletPointInput: React.FC<BulletPointInputProps> = ({ 
  bulletPointText, setBulletPointText, 
  missingKeywords, setMissingKeywords, 
  disabled,
  undoBulletPoint, redoBulletPoint, canUndoBulletPoint, canRedoBulletPoint,
  undoMissingKeywords, redoMissingKeywords, canUndoMissingKeywords, canRedoMissingKeywords
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-3">
            <label htmlFor="bullet-point-text" className="text-lg font-semibold text-gray-200">
                Bullet Point to Rewrite
            </label>
            <div className="flex items-center gap-2">
                <button onClick={undoBulletPoint} disabled={!canUndoBulletPoint || disabled} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors" aria-label="Undo"><UndoIcon className="w-5 h-5" /></button>
                <button onClick={redoBulletPoint} disabled={!canRedoBulletPoint || disabled} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors" aria-label="Redo"><RedoIcon className="w-5 h-5" /></button>
            </div>
        </div>
        <textarea
          id="bullet-point-text"
          value={bulletPointText}
          onChange={(e) => setBulletPointText(e.target.value)}
          placeholder="e.g., Was responsible for managing the project."
          className="w-full h-24 bg-gray-800/50 text-gray-300 p-4 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-y"
          disabled={disabled}
        />
      </div>
      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-3">
            <label htmlFor="missing-keywords" className="text-lg font-semibold text-gray-200">
            Keywords to Include (Optional)
            </label>
            <div className="flex items-center gap-2">
                <button onClick={undoMissingKeywords} disabled={!canUndoMissingKeywords || disabled} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors" aria-label="Undo"><UndoIcon className="w-5 h-5" /></button>
                <button onClick={redoMissingKeywords} disabled={!canRedoMissingKeywords || disabled} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors" aria-label="Redo"><RedoIcon className="w-5 h-5" /></button>
            </div>
        </div>
        <textarea
          id="missing-keywords"
          value={missingKeywords}
          onChange={(e) => setMissingKeywords(e.target.value)}
          placeholder="e.g., Agile, CI/CD, Terraform, Kubernetes"
          className="w-full h-24 bg-gray-800/50 text-gray-300 p-4 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-y"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default BulletPointInput;
