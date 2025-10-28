
import React from 'react';

interface BulletPointInputProps {
  bulletPointText: string;
  setBulletPointText: (text: string) => void;
  missingKeywords: string;
  setMissingKeywords: (text: string) => void;
  disabled: boolean;
}

const BulletPointInput: React.FC<BulletPointInputProps> = ({ bulletPointText, setBulletPointText, missingKeywords, setMissingKeywords, disabled }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        <label htmlFor="bullet-point-text" className="text-lg font-semibold text-gray-200 mb-3 block">
          Bullet Point to Rewrite
        </label>
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
        <label htmlFor="missing-keywords" className="text-lg font-semibold text-gray-200 mb-3 block">
          Keywords to Include (Optional)
        </label>
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
