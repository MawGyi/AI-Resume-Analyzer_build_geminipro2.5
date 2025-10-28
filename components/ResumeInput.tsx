
import React, { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import UploadIcon from './icons/UploadIcon';

// Use a stable, versioned CDN for the worker script
const PDF_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;


interface ResumeInputProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  disabled: boolean;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ resumeText, setResumeText, disabled }) => {
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
  
  const isDisabled = disabled || isReadingFile;

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex-grow flex flex-col">
       <div className="flex justify-between items-center mb-3">
        <label htmlFor="resume-text" className="text-lg font-semibold text-gray-200">
          Your Resume
        </label>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.md,.pdf"
            disabled={isDisabled}
          />
          <button
            onClick={handleUploadClick}
            disabled={isDisabled}
            className="flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors disabled:text-gray-500 disabled:cursor-wait"
          >
            <UploadIcon className="w-5 h-5" />
            {isReadingFile ? 'Reading...' : 'Upload Resume'}
          </button>
        </div>
      </div>
      {fileError && <p className="text-red-400 text-xs mb-2 -mt-2">{fileError}</p>}
      <textarea
        id="resume-text"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder={isReadingFile ? "Reading file..." : "Paste your resume content here..."}
        className="w-full flex-grow bg-gray-800/50 text-gray-300 p-4 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-none"
        rows={15}
        disabled={isDisabled}
      />
    </div>
  );
};

export default ResumeInput;
