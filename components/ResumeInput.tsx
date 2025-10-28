import React, { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import UploadIcon from './icons/UploadIcon';
import SparklesIcon from './icons/SparklesIcon';

// Use a stable, versioned CDN for the worker script
const PDF_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;


interface ResumeInputProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ resumeText, setResumeText, onAnalyze, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setIsReadingFile(true);
    setResumeText(''); // Clear previous text to indicate new file is being processed

    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (!e.target?.result) {
            setFileError('Failed to read the PDF file.');
            setIsReadingFile(false);
            return;
          }
          try {
            const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
            const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
            const textPromises = [];
            for (let i = 1; i <= pdfDoc.numPages; i++) {
              textPromises.push(
                pdfDoc.getPage(i).then(page => page.getTextContent())
              );
            }
            const textContents = await Promise.all(textPromises);
            const fullText = textContents.map(content =>
              content.items.map(item => ('str' in item ? item.str : '')).join(' ')
            ).join('\n\n'); // Separate pages with double newline

            setResumeText(fullText.trim());
          } catch (pdfError) {
            console.error('Error parsing PDF:', pdfError);
            setFileError('Could not parse the PDF. It may be corrupted, protected, or an image-based PDF.');
          } finally {
            setIsReadingFile(false);
          }
        };
        reader.onerror = () => {
          setFileError('An error occurred while reading the file.');
          setIsReadingFile(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
          setIsReadingFile(false);
        };
        reader.onerror = () => {
          setFileError('An error occurred while reading the file.');
          setIsReadingFile(false);
        };
        reader.readAsText(file);
      } else {
        setFileError(`Unsupported file type. Please upload a .txt, .md, or .pdf file.`);
        setIsReadingFile(false);
      }
    } catch (err) {
      console.error("Error in handleFileChange:", err);
      setFileError('An unexpected error occurred while processing the file.');
      setIsReadingFile(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Allow re-uploading the same file
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white/5 p-6 rounded-t-xl border border-b-0 border-white/10 flex-grow flex flex-col">
        <label htmlFor="resume-text" className="text-lg font-semibold text-gray-200 mb-3">
          Your Resume
        </label>
        <textarea
          id="resume-text"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder={isReadingFile ? "Reading file..." : "Paste your resume content here..."}
          className="w-full flex-grow bg-gray-800/50 text-gray-300 p-4 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-none"
          rows={20}
          disabled={isReadingFile}
        />
      </div>
      <div className="bg-white/10 p-4 rounded-b-xl border border-t-0 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.md,.pdf"
            disabled={isReadingFile}
          />
          <button
            onClick={handleUploadClick}
            disabled={isReadingFile}
            className="flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors disabled:text-gray-500 disabled:cursor-wait"
          >
            <UploadIcon className="w-5 h-5" />
            {isReadingFile ? 'Reading file...' : 'Upload .txt, .md or .pdf'}
          </button>
           {fileError && <p className="text-red-400 text-xs mt-2">{fileError}</p>}
        </div>
        <button
          onClick={onAnalyze}
          disabled={isLoading || !resumeText.trim() || isReadingFile}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Analyze Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeInput;