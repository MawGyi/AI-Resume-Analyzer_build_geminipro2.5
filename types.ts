
export interface AnalysisResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestedKeywords: string[];
  formattingFeedback: string;
}

export interface MatchResult {
  match_score: number;
  match_summary: string;
  keywords_found: string[];
  keywords_missing: string[];
  experience_gap: string;
}

export type RewriteResult = string[];

export type CoverLetterResult = string;

export interface ATSResult {
  contact_info: {
    name: string | null;
    email: string | null;
    phone: string | null;
    linkedin: string | null;
  };
  summary: string | null;
  work_experience: {
    job_title: string | null;
    company: string | null;
    start_date: string | null;
    end_date: string | null;
    responsibilities: string[];
  }[];
  education: {
    degree: string | null;
    school: string | null;
    graduation_date: string | null;
  }[];
  skills: string[];
}

export interface InterviewQuestionsResult {
  behavioral_questions: string[];
  skill_gap_questions: string[];
  situational_questions: string[];
}

export interface CriticalError {
  field: string;
  issue: string;
}

export interface ATSAuditResult {
  parse_quality: "Excellent" | "Good" | "Poor";
  summary_feedback: string;
  critical_errors: CriticalError[];
  action_recommendation: string;
}
