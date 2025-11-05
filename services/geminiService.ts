
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, MatchResult, RewriteResult, CoverLetterResult, ATSResult, InterviewQuestionsResult, ATSAuditResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const proModel = 'gemini-2.5-pro';
const flashModel = 'gemini-2.5-flash';

// Helper to parse JSON response from the model
async function generateAndParseJson<T>(model: string, prompt: string, schema: any): Promise<T> {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
    
    const text = response.text.trim();
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error generating or parsing JSON from Gemini:', error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The API key is not valid. Please ensure it is set up correctly.');
        }
        throw new Error(`An error occurred while communicating with the AI: ${error.message}`);
    }
    throw new Error('An unknown error occurred during the AI request.');
  }
}

// Schemas based on types.ts
const analysisResultSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "A score from 0 to 100." },
    summary: { type: Type.STRING, description: "A brief summary of the resume." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of strengths." },
    areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of areas for improvement." },
    suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of suggested keywords to add." },
    formattingFeedback: { type: Type.STRING, description: "Feedback on the resume's formatting." },
  },
  required: ['overallScore', 'summary', 'strengths', 'areasForImprovement', 'suggestedKeywords', 'formattingFeedback'],
};

const matchResultSchema = {
  type: Type.OBJECT,
  properties: {
    match_score: { type: Type.NUMBER, description: "A score from 0 to 100 indicating the match." },
    match_summary: { type: Type.STRING, description: "A summary of how well the resume matches the job." },
    keywords_found: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords from the job description found in the resume." },
    keywords_missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Important keywords missing from the resume." },
    experience_gap: { type: Type.STRING, description: "Analysis of any experience gaps." },
  },
  required: ['match_score', 'match_summary', 'keywords_found', 'keywords_missing', 'experience_gap'],
};

const rewriteResultSchema = {
  type: Type.OBJECT,
  properties: {
    rewritten_bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 3-5 rewritten bullet points."
    }
  },
  required: ['rewritten_bullets']
};

const coverLetterResultSchema = {
    type: Type.OBJECT,
    properties: {
        coverLetter: { type: Type.STRING, description: "The full text of the generated cover letter." }
    },
    required: ['coverLetter']
};

const atsResultSchema = {
  type: Type.OBJECT,
  properties: {
    contact_info: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Full name, or null if not found." },
        email: { type: Type.STRING, description: "Email address, or null if not found." },
        phone: { type: Type.STRING, description: "Phone number, or null if not found." },
        linkedin: { type: Type.STRING, description: "LinkedIn profile URL, or null if not found." },
      },
    },
    summary: { type: Type.STRING, description: "Professional summary, or null if not found." },
    work_experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          job_title: { type: Type.STRING, description: "Job title, or null if not found." },
          company: { type: Type.STRING, description: "Company name, or null if not found." },
          start_date: { type: Type.STRING, description: "Start date, or null if not found." },
          end_date: { type: Type.STRING, description: "End date (or 'Present'), or null if not found." },
          responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING, description: "Degree obtained, or null if not found." },
          school: { type: Type.STRING, description: "School name, or null if not found." },
          graduation_date: { type: Type.STRING, description: "Graduation date, or null if not found." },
        },
      },
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
};

const interviewQuestionsResultSchema = {
    type: Type.OBJECT,
    properties: {
        behavioral_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        skill_gap_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        situational_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['behavioral_questions', 'skill_gap_questions', 'situational_questions']
};

const atsAuditResultSchema = {
    type: Type.OBJECT,
    properties: {
        parse_quality: { type: Type.STRING, description: "Enum: 'Excellent', 'Good', or 'Poor'" },
        summary_feedback: { type: Type.STRING },
        critical_errors: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    field: { type: Type.STRING },
                    issue: { type: Type.STRING }
                },
                required: ['field', 'issue']
            }
        },
        action_recommendation: { type: Type.STRING }
    },
    required: ['parse_quality', 'summary_feedback', 'critical_errors', 'action_recommendation']
};


// --- AI Feature Services ---

export const analyzeResume = (resumeText: string): Promise<AnalysisResult> => {
  const prompt = `
    Analyze the following resume text and provide a comprehensive review. 
    Evaluate it on content, clarity, impact, and keyword optimization.
    - Overall Score: A rating from 0-100. 
    - Summary: A concise overview.
    - Strengths: 3-5 key positive aspects.
    - Areas for Improvement: 3-5 actionable suggestions.
    - Suggested Keywords: Keywords relevant to the roles implied by the resume.
    - Formatting Feedback: Comments on layout, readability, and structure.

    Resume Text:
    ---
    ${resumeText}
    ---
    
    Return the analysis in the specified JSON format.
  `;
  return generateAndParseJson<AnalysisResult>(proModel, prompt, analysisResultSchema);
};

export const matchResumeToJob = (resumeText: string, jobDescriptionText:string): Promise<MatchResult> => {
  const prompt = `
    Analyze the provided resume against the job description.
    - Match Score: A percentage score (0-100) of how well the resume aligns with the job.
    - Match Summary: A paragraph explaining the score.
    - Keywords Found: List keywords from the job description present in the resume.
    - Keywords Missing: List critical keywords from the job description NOT in the resume.
    - Experience Gap: Analyze and describe any gaps in required experience.

    Resume Text:
    ---
    ${resumeText}
    ---
    Job Description:
    ---
    ${jobDescriptionText}
    ---
    
    Return the analysis in the specified JSON format.
  `;
  return generateAndParseJson<MatchResult>(proModel, prompt, matchResultSchema);
};

export const rewriteBulletPoint = async (bulletPoint: string, missingKeywords: string): Promise<RewriteResult> => {
    const prompt = `
    Rewrite the following resume bullet point to be more impactful and action-oriented, using the STAR method (Situation, Task, Action, Result) where possible.
    If any 'Missing Keywords' are provided, try to naturally incorporate them. 
    Generate 3-5 diverse variations.

    Original Bullet Point: "${bulletPoint}"
    ${missingKeywords ? `Missing Keywords to include: "${missingKeywords}"` : ''}
    
    Return the variations as an array of strings in the specified JSON format.
  `;
  const result = await generateAndParseJson<{ rewritten_bullets: RewriteResult }>(flashModel, prompt, rewriteResultSchema);
  return result.rewritten_bullets;
};

export const generateCoverLetter = async (resumeText: string, jobDescriptionText: string): Promise<CoverLetterResult> => {
    const prompt = `
    Write a professional and compelling cover letter based on the provided resume and job description. 
    The tone should be confident but not arrogant. The letter should highlight the most relevant skills and experiences from the resume that match the job requirements.
    Structure it with an introduction, body paragraphs, and a conclusion with a call to action.
    Return the complete cover letter as a single string.
    
    Resume Text:
    ---
    ${resumeText}
    ---
    Job Description:
    ---
    ${jobDescriptionText}
    ---
    
    Return the cover letter in the specified JSON format.
  `;
  const result = await generateAndParseJson<{ coverLetter: string }>(proModel, prompt, coverLetterResultSchema);
  return result.coverLetter;
};

export const parseResumeATS = (resumeText: string): Promise<ATSResult> => {
  const prompt = `
    Parse the following resume text as an Applicant Tracking System (ATS) would.
    Extract the contact information, summary, work experience (including responsibilities), education, and skills.
    For dates, try to standardize them (e.g., YYYY-MM) but return null if unclear.
    If a field is not found, return null for that field.

    Resume Text:
    ---
    ${resumeText}
    ---

    Return the parsed data in the specified JSON format.
  `;
  return generateAndParseJson<ATSResult>(proModel, prompt, atsResultSchema);
};

export const generateInterviewQuestions = (resumeText: string, jobDescriptionText: string): Promise<InterviewQuestionsResult> => {
    const prompt = `
    Based on the provided resume and job description, generate a list of targeted interview questions.
    - Behavioral Questions: 3-5 questions to assess soft skills and past behavior (e.g., "Tell me about a time when...").
    - Skill Gap Questions: 3-5 questions to probe areas where the resume seems weaker compared to the job description.
    - Situational Questions: 3-5 hypothetical questions to assess problem-solving skills (e.g., "What would you do if...").

    Resume Text:
    ---
    ${resumeText}
    ---
    Job Description:
    ---
    ${jobDescriptionText}
    ---

    Return the questions in the specified JSON format.
  `;
  return generateAndParseJson<InterviewQuestionsResult>(proModel, prompt, interviewQuestionsResultSchema);
};

export const auditATSParsing = (atsResult: ATSResult): Promise<ATSAuditResult> => {
  const prompt = `
    Review the following JSON data, which represents a resume parsed by an Applicant Tracking System (ATS).
    - Parse Quality: Rate the quality as 'Excellent', 'Good', or 'Poor'.
    - Summary Feedback: Provide a brief summary of the parsing quality.
    - Critical Errors: Identify any significant errors (e.g., miscategorized sections, truncated text, incorrect dates) in a list. If none, return an empty list.
    - Action Recommendation: Suggest how the original resume could be formatted differently to improve parsing.

    ATS Parsed JSON:
    ---
    ${JSON.stringify(atsResult, null, 2)}
    ---

    Return your audit in the specified JSON format.
  `;
  return generateAndParseJson<ATSAuditResult>(proModel, prompt, atsAuditResultSchema);
};
