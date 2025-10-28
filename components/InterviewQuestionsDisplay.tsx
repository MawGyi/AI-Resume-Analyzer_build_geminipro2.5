
import React from 'react';
import type { InterviewQuestionsResult } from '../types';
import Loader from './Loader';

interface InterviewQuestionsDisplayProps {
  result: InterviewQuestionsResult | null;
  isLoading: boolean;
  error: string | null;
}

const QuestionCard: React.FC<{ title: string; questions: string[]; icon: React.ReactNode }> = ({ title, questions, icon }) => (
  <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-blue-500/10 p-2 rounded-lg">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
    </div>
    <ul className="space-y-3 text-gray-300">
      {questions.map((q, index) => (
        <li key={index} className="flex items-start gap-3">
            <span className="text-blue-400 mt-1 font-semibold">&bull;</span>
            <span>{q}</span>
        </li>
      ))}
    </ul>
  </div>
);


const InterviewQuestionsDisplay: React.FC<InterviewQuestionsDisplayProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-red-500/50 text-center">
        <div className="w-12 h-12 text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">Generation Error</h3>
        <p className="mt-2 text-red-300">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white/5 p-6 rounded-xl border border-white/10 text-center">
        <div className="w-12 h-12 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h8.25M8.25 12h5.25M8.25 17.25h8.25M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">Interview Question Generator</h3>
        <p className="mt-2 text-gray-400">Your custom-tailored interview questions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
      <QuestionCard 
        title="Behavioral Questions" 
        questions={result.behavioral_questions} 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V8z" /></svg>}
      />
      <QuestionCard 
        title="Skill Gap Questions" 
        questions={result.skill_gap_questions}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.927m0 0A7.25 7.25 0 002.75 12V8.646a4.5 4.5 0 01.95-2.859L5 5.292m2.859 0a2.25 2.25 0 012.89 0l.214.215 1.353-1.353a2.25 2.25 0 012.89 0l.43.43a2.25 2.25 0 010 2.89l-1.588 1.588l-1.28-1.282a4 4 0 00-5.656 0z" /></svg>}
       />
      <QuestionCard 
        title="Situational Questions" 
        questions={result.situational_questions}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
      />
    </div>
  );
};

export default InterviewQuestionsDisplay;
