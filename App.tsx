
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ResumeInput from './components/ResumeInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import JobDescriptionInput from './components/JobDescriptionInput';
import MatchDisplay from './components/MatchDisplay';
import Tabs from './components/Tabs';
import SparklesIcon from './components/icons/SparklesIcon';
import { analyzeResume, matchResumeToJob, rewriteBulletPoint, generateCoverLetter, parseResumeATS, generateInterviewQuestions, auditATSParsing } from './services/geminiService';
import type { AnalysisResult, MatchResult, RewriteResult, CoverLetterResult, ATSResult, InterviewQuestionsResult, ATSAuditResult } from './types';
import BulletPointInput from './components/BulletPointInput';
import RewriteDisplay from './components/RewriteDisplay';
import CoverLetterDisplay from './components/CoverLetterDisplay';
import ATSDisplay from './components/ATSDisplay';
import InterviewQuestionsDisplay from './components/InterviewQuestionsDisplay';

type Mode = 'analysis' | 'match' | 'rewrite' | 'cover' | 'ats' | 'interview';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('analysis');
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [bulletPointText, setBulletPointText] = useState<string>('');
  const [missingKeywords, setMissingKeywords] = useState<string>('');
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResult | null>(null);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [interviewQuestionsResult, setInterviewQuestionsResult] = useState<InterviewQuestionsResult | null>(null);
  const [atsAuditResult, setAtsAuditResult] = useState<ATSAuditResult | null>(null);


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const handleSetMode = (newMode: Mode) => {
    // Clear all results and errors when switching modes for a clean slate
    setAnalysisResult(null);
    setMatchResult(null);
    setRewriteResult(null);
    setCoverLetterResult(null);
    setAtsResult(null);
    setInterviewQuestionsResult(null);
    setAtsAuditResult(null);
    setError(null);
    setAuditError(null);
    // Set the new mode
    setMode(newMode);
  };

  const handleAction = useCallback(async () => {
    // Reset state before new request
    setError(null);
    setAnalysisResult(null);
    setMatchResult(null);
    setRewriteResult(null);
    setCoverLetterResult(null);
    setAtsResult(null);
    setInterviewQuestionsResult(null);
    setAtsAuditResult(null);
    setAuditError(null);
    setIsLoading(true);

    if (mode === 'analysis' || mode === 'ats') {
      if (!resumeText.trim()) {
        setError('Please enter your resume text before analyzing.');
        setIsLoading(false);
        return;
      }

      try {
        if (mode === 'analysis') {
          const result = await analyzeResume(resumeText);
          setAnalysisResult(result);
        } else {
          const result = await parseResumeATS(resumeText);
          setAtsResult(result);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Analysis failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'match' || mode === 'cover' || mode === 'interview') {
      if (!resumeText.trim() || !jobDescriptionText.trim()) {
        setError('Please provide both a resume and a job description.');
        setIsLoading(false);
        return;
      }
      
      try {
        if (mode === 'match') {
            const result = await matchResumeToJob(resumeText, jobDescriptionText);
            setMatchResult(result);
        } else if (mode === 'cover'){
            const result = await generateCoverLetter(resumeText, jobDescriptionText);
            setCoverLetterResult(result);
        } else { // mode === 'interview'
            const result = await generateInterviewQuestions(resumeText, jobDescriptionText);
            setInterviewQuestionsResult(result);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Analysis failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    } else { // mode === 'rewrite'
        if (!bulletPointText.trim()) {
            setError('Please enter a bullet point to rewrite.');
            setIsLoading(false);
            return;
        }
        try {
            const result = await rewriteBulletPoint(bulletPointText, missingKeywords);
            setRewriteResult(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Rewrite failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }
  }, [resumeText, jobDescriptionText, bulletPointText, missingKeywords, mode]);

  const handleAudit = useCallback(async () => {
    if (!atsResult) return;
    
    setAuditError(null);
    setAtsAuditResult(null);
    setIsAuditing(true);
    
    try {
        const result = await auditATSParsing(atsResult);
        setAtsAuditResult(result);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setAuditError(`Audit failed: ${errorMessage}`);
    } finally {
        setIsAuditing(false);
    }
  }, [atsResult]);

  const ActionButton = () => {
    let buttonText = 'Analyze';
    let isDisabled = isLoading;

    if (mode === 'analysis') {
        buttonText = 'Analyze Resume';
        isDisabled = isLoading || !resumeText.trim();
    } else if (mode === 'match') {
        buttonText = 'Analyze Match';
        isDisabled = isLoading || !resumeText.trim() || !jobDescriptionText.trim();
    } else if (mode === 'cover') {
        buttonText = 'Generate Cover Letter';
        isDisabled = isLoading || !resumeText.trim() || !jobDescriptionText.trim();
    } else if (mode === 'ats') {
        buttonText = 'Parse for ATS';
        isDisabled = isLoading || !resumeText.trim();
    } else if (mode === 'interview') {
        buttonText = 'Generate Questions';
        isDisabled = isLoading || !resumeText.trim() || !jobDescriptionText.trim();
    } else {
        buttonText = 'Rewrite Bullet Point';
        isDisabled = isLoading || !bulletPointText.trim();
    }

    return (
      <div className="mt-8">
        <button
          onClick={handleAction}
          disabled={isDisabled}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
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
              {buttonText}
            </>
          )}
        </button>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="relative isolate min-h-screen overflow-hidden bg-gray-900">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
        </svg>
        <div
          className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64.3%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 1.4% 98.3%, 12.1% 75.2%, 25.7% 75.2%, 36.2% 49.4%, 44.1% 40.7%, 66.4% 18.2%, 73.6% 51.7%)',
            }}
          />
        </div>

        <main className="container mx-auto px-4 py-8 md:py-12">
          <Header />
          <Tabs activeTab={mode} setActiveTab={handleSetMode} />
          <div className="flex flex-col gap-8 mt-8">
            {/* Input fields and action button are grouped together at the top */}
            <div className="flex flex-col">
              {mode === 'rewrite' ? (
                 <BulletPointInput
                    bulletPointText={bulletPointText}
                    setBulletPointText={setBulletPointText}
                    missingKeywords={missingKeywords}
                    setMissingKeywords={setMissingKeywords}
                    disabled={isLoading}
                />
              ) : (
                <>
                  <ResumeInput
                    resumeText={resumeText}
                    setResumeText={setResumeText}
                    disabled={isLoading}
                  />
                  {(mode === 'match' || mode === 'cover' || mode === 'interview') && (
                    <JobDescriptionInput
                      jobDescriptionText={jobDescriptionText}
                      setJobDescriptionText={setJobDescriptionText}
                      disabled={isLoading}
                    />
                  )}
                </>
              )}
              <ActionButton />
            </div>

            {/* Results display area appears below, separated by a divider */}
            {/* This section only renders if there is a result, error, or loading state */}
            {(isLoading || error || analysisResult || matchResult || rewriteResult || coverLetterResult || atsResult || interviewQuestionsResult) && (
              <div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-900 px-4 text-lg font-medium text-gray-400">
                      Results
                    </span>
                  </div>
                </div>

                {mode === 'analysis' && (
                  <AnalysisDisplay result={analysisResult} isLoading={isLoading} error={error} />
                )}
                {mode === 'match' && (
                  <MatchDisplay result={matchResult} isLoading={isLoading} error={error} />
                )}
                {mode === 'rewrite' && (
                  <RewriteDisplay result={rewriteResult} isLoading={isLoading} error={error} />
                )}
                {mode === 'cover' && (
                  <CoverLetterDisplay result={coverLetterResult} isLoading={isLoading} error={error} />
                )}
                {mode === 'ats' && (
                  <ATSDisplay 
                    result={atsResult} 
                    isLoading={isLoading} 
                    error={error} 
                    onAudit={handleAudit}
                    auditResult={atsAuditResult}
                    isAuditing={isAuditing}
                    auditError={auditError}
                  />
                )}
                {mode === 'interview' && (
                  <InterviewQuestionsDisplay result={interviewQuestionsResult} isLoading={isLoading} error={error} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
