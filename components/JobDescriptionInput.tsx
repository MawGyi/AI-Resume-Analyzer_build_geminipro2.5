
import React from 'react';

interface JobDescriptionInputProps {
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  disabled: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ jobDescriptionText, setJobDescriptionText, disabled }) => {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-8">
      <label htmlFor="job-description-text" className="text-lg font-semibold text-gray-200 mb-3 block">
        Job Description
      </label>
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
