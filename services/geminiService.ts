
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, MatchResult, RewriteResult, CoverLetterResult, ATSResult, InterviewQuestionsResult, ATSAuditResult } from '../types';

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: "An overall score for the resume out of 100, based on clarity, impact, formatting, and ATS compatibility.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, two-sentence summary of the resume's effectiveness and the candidate's professional profile.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A bulleted list of 3-5 key strengths of the resume, highlighting impactful language and strong, quantifiable achievements.",
    },
    areasForImprovement: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A bulleted list of 3-5 specific, actionable areas where the resume could be improved, focusing on weak phrasing, missing information, or unclear points.",
    },
    suggestedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of relevant keywords, skills, and action verbs that could be incorporated to better align with Applicant Tracking Systems (ATS) and specific job roles in the tech industry.",
    },
    formattingFeedback: {
      type: Type.STRING,
      description: "Constructive feedback on the resume's layout, font choice, and overall visual presentation. Comment on readability, professionalism, and use of white space.",
    },
  },
  required: ['overallScore', 'summary', 'strengths', 'areasForImprovement', 'suggestedKeywords', 'formattingFeedback'],
};

const matchSchema = {
    type: Type.OBJECT,
    properties: {
        match_score: {
            type: Type.INTEGER,
            description: "A percentage (e.g., 75) representing how well the resume matches the job description.",
        },
        match_summary: {
            type: Type.STRING,
            description: "A 2-sentence summary explaining the score (e.g., \"Strong match in 'Java' and 'Agile', but missing key 'Azure' and 'Terraform' skills.\")",
        },
        keywords_found: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of the top 10 most important keywords from the job description that were successfully found in the resume.",
        },
        keywords_missing: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of the top 10 most critical keywords from the job description that are missing from the resume.",
        },
        experience_gap: {
            type: Type.STRING,
            description: "A brief analysis of any major gaps in years of experience or specific qualifications (e.g., \"Job requires 5+ YOE in product management; resume shows 3 YOE.\")",
        }
    },
    required: ['match_score', 'match_summary', 'keywords_found', 'keywords_missing', 'experience_gap'],
};

const rewriteSchema = {
    type: Type.OBJECT,
    properties: {
        rewritten_bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3 distinct, rewritten bullet points."
        }
    },
    required: ['rewritten_bullets']
};

const atsSchema = {
  type: Type.OBJECT,
  properties: {
    contact_info: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Full name of the candidate. Return null if not found." },
        email: { type: Type.STRING, description: "Email address. Return null if not found." },
        phone: { type: Type.STRING, description: "Phone number. Return null if not found." },
        linkedin: { type: Type.STRING, description: "URL to LinkedIn profile. Return null if not found." },
      },
    },
    summary: {
      type: Type.STRING,
      description: "The professional summary or objective statement. Return null if not found."
    },
    work_experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          job_title: { type: Type.STRING, description: "Return null if not found." },
          company: { type: Type.STRING, description: "Return null if not found." },
          start_date: { type: Type.STRING, description: "Return null if not found." },
          end_date: { type: Type.STRING, description: "Can be 'Present' or a date. Return null if not found." },
          responsibilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING, description: "Return null if not found." },
          school: { type: Type.STRING, description: "Return null if not found." },
          graduation_date: { type: Type.STRING, description: "Return null if not found." }
        }
      }
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ['contact_info', 'summary', 'work_experience', 'education', 'skills']
};

const interviewSchema = {
    type: Type.OBJECT,
    properties: {
        behavioral_questions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of questions asking for specific examples based on their resume (e.g., \"Your resume says you 'Led a new product launch.' Tell me about a time during that launch when you had to overcome a major obstacle.\")",
        },
        skill_gap_questions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of questions that politely probe areas where the resume is weak compared to the job description (e.g., \"I see you have extensive experience in [Resume Skill], but this role heavily uses [Job Skill]. How would you approach getting up to speed?\")",
        },
        situational_questions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of questions that present a hypothetical problem from the job description (e.g., \"Imagine you're asked to [Job Duty]. What would be your first 30 days?\")",
        },
    },
    required: ['behavioral_questions', 'skill_gap_questions', 'situational_questions'],
};

const atsAuditSchema = {
  type: Type.OBJECT,
  properties: {
    parse_quality: {
      type: Type.STRING,
      description: 'A single-word rating: "Excellent", "Good", or "Poor".',
    },
    summary_feedback: {
      type: Type.STRING,
      description: "A one-sentence summary for the user.",
    },
    critical_errors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          field: { type: Type.STRING },
          issue: { type: Type.STRING },
        },
        required: ['field', 'issue'],
      },
      description: "A list of specific problems found. If none, return [].",
    },
    action_recommendation: {
      type: Type.STRING,
      description: "A simple next step for the user.",
    },
  },
  required: ['parse_quality', 'summary_feedback', 'critical_errors', 'action_recommendation'],
};


export const analyzeResume = async (resumeText: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please analyze the following resume text and provide a detailed review based on the provided JSON schema. \n\n---RESUME TEXT---\n${resumeText}`,
      config: {
        systemInstruction: "You are an expert career coach and professional resume writer with over 15 years of experience hiring for top tech companies. Your task is to provide a critical and constructive analysis of a resume. Your feedback must be direct, actionable, and tailored to help the user land interviews for technical roles (e.g., Software Engineer, Data Scientist, Product Manager). Focus on quantifiable achievements, STAR method, powerful action verbs, and ATS compatibility.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3,
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
         throw new Error("The analysis was blocked due to safety concerns. Please ensure your resume does not contain sensitive personal information or inappropriate content.");
    }
    throw new Error("Could not get a valid analysis from the AI. The model may be overloaded or the input is invalid. Please try again later.");
  }
};

export const matchResumeToJob = async (resumeText: string, jobDescriptionText: string): Promise<MatchResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Task: Analyze the provided [RESUME_TEXT] against the [JOB_DESCRIPTION_TEXT].

[RESUME_TEXT]
${resumeText}
[/RESUME_TEXT]

[JOB_DESCRIPTION_TEXT]
${jobDescriptionText}
[/JOB_DESCRIPTION_TEXT]
`,
            config: {
                systemInstruction: "You are an expert AI-powered career coach. Your task is to analyze the provided [RESUME_TEXT] against the [JOB_DESCRIPTION_TEXT]. Your output must be in the specified JSON format.",
                responseMimeType: "application/json",
                responseSchema: matchSchema,
                temperature: 0.2,
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as MatchResult;

    } catch (error) {
        console.error("Error matching resume to job:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The analysis was blocked due to safety concerns. Please ensure the content does not contain sensitive personal information or inappropriate content.");
        }
        throw new Error("Could not get a valid analysis from the AI. The model may be overloaded or the input is invalid. Please try again later.");
    }
};

export const rewriteBulletPoint = async (bulletPoint: string, missingKeywords: string): Promise<RewriteResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Task: Rewrite the following [BULLET_POINT_TEXT].

[BULLET_POINT_TEXT]
${bulletPoint}
[/BULLET_POINT_TEXT]

[MISSING_KEYWORDS_LIST]
${missingKeywords || 'N/A'}
[/MISSING_KEYWORDS_LIST]
`,
            config: {
                systemInstruction: `You are an expert resume writer. Your specialty is transforming weak, passive bullet points into powerful, metric-driven achievements.

Rules:
1. Start with a strong action verb (e.g., "Orchestrated," "Streamlined," "Engineered").
2. Incorporate a quantifiable metric or result. Use a placeholder like [Number] or [Percentage] for the user to fill in. (e.g., "...resulting in a [Percentage]% increase in efficiency.")
3. If possible, naturally integrate one or more keywords from the [MISSING_KEYWORDS_LIST]. If the list is 'N/A' or empty, ignore this rule.
4. Provide 3 distinct variations as a list.`,
                responseMimeType: "application/json",
                responseSchema: rewriteSchema,
                temperature: 0.5,
            }
        });
        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr) as { rewritten_bullets: RewriteResult };
        return parsed.rewritten_bullets;

    } catch (error) {
        console.error("Error rewriting bullet point:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The analysis was blocked due to safety concerns. Please ensure the content does not contain sensitive personal information or inappropriate content.");
        }
        throw new Error("Could not get a valid rewrite from the AI. The model may be overloaded or the input is invalid. Please try again later.");
    }
};

export const generateCoverLetter = async (resumeText: string, jobDescriptionText: string): Promise<CoverLetterResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Task: Write a persuasive and concise cover letter.

[RESUME_TEXT]
${resumeText}
[/RESUME_TEXT]

[JOB_DESCRIPTION_TEXT]
${jobDescriptionText}
[/JOB_DESCRIPTION_TEXT]
`,
            config: {
                systemInstruction: `You are a professional career writer.

Task: Write a persuasive and concise cover letter.

Context:
The candidate's resume is [RESUME_TEXT].
The job they are applying for is [JOB_DESCRIPTION_TEXT].

Instructions:
1. The tone must be professional, enthusiastic, and confident.
2. Do NOT simply summarize the resume.
3. Identify the top 2-3 key requirements from the job description.
4. Write a 3-paragraph letter:
Paragraph 1: Introduce the candidate and the specific role.
Paragraph 2: Highlight the candidate's specific achievements from their resume that directly prove they can meet the job's top requirements.
Paragraph 3: Reiterate enthusiasm and include a strong call to action (e.g., "I am eager to discuss how my experience in [Key Skill] can help your team achieve its goals.")`,
                temperature: 0.4,
            }
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating cover letter:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The analysis was blocked due to safety concerns. Please ensure the content does not contain sensitive personal information or inappropriate content.");
        }
        throw new Error("Could not get a valid cover letter from the AI. The model may be overloaded or the input is invalid. Please try again later.");
    }
};

export const parseResumeATS = async (resumeText: string): Promise<ATSResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `[PLAINTEXT_RESUME]\n${resumeText}`,
            config: {
                systemInstruction: `You are an Applicant Tracking System (ATS) parsing bot. Your only function is to extract structured data from unstructured text. You are not a writer or a coach.

Task: Read the [PLAINTEXT_RESUME] and extract its contents into a strict JSON format. If you cannot find information for a field, return null. Do not invent or infer information.`,
                responseMimeType: "application/json",
                responseSchema: atsSchema,
                temperature: 0.0,
            }
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as ATSResult;

    } catch (error) {
        console.error("Error parsing resume for ATS:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The parsing was blocked due to safety concerns. Please ensure your resume does not contain sensitive personal information or inappropriate content.");
        }
        throw new Error("Could not get a valid parse from the AI. The model may be overloaded or the input is invalid. Please try again later.");
    }
};

export const generateInterviewQuestions = async (resumeText: string, jobDescriptionText: string): Promise<InterviewQuestionsResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Task: Generate a list of 10 highly specific interview questions to ask this candidate.

[RESUME_TEXT]
${resumeText}
[/RESUME_TEXT]

[JOB_DESCRIPTION_TEXT]
${jobDescriptionText}
[/JOB_DESCRIPTION_TEXT]
`,
            config: {
                systemInstruction: `You are a hiring manager for the role described in the [JOB_DESCRIPTION_TEXT]. You are preparing to interview a candidate whose resume is [RESUME_TEXT].

Task: Generate a list of 10 highly specific interview questions to ask this candidate.

Instructions:
1. Do NOT ask generic questions like "What's your greatest weakness?"
2. Create 3 categories of questions and provide a JSON list: behavioral_questions, skill_gap_questions, and situational_questions.`,
                responseMimeType: "application/json",
                responseSchema: interviewSchema,
                temperature: 0.5,
            }
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as InterviewQuestionsResult;

    } catch (error) {
        console.error("Error generating interview questions:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The generation was blocked due to safety concerns. Please ensure the content does not contain sensitive personal information or inappropriate content.");
        }
        throw new Error("Could not get a valid set of questions from the AI. The model may be overloaded or the input is invalid. Please try again later.");
    }
};

export const auditATSParsing = async (atsJson: ATSResult): Promise<ATSAuditResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Task: Generate a user-friendly report based on the JSON data.

[ATS_JSON_OUTPUT]
${JSON.stringify(atsJson, null, 2)}
[/ATS_JSON_OUTPUT]
`,
            config: {
                systemInstruction: `You are an ATS Quality Assurance Bot. Your job is to analyze the provided [ATS_JSON_OUTPUT] to check for common parsing errors.

Analysis Checklist:
- Critical Fields: Check for null, [], or empty values in contact_info.name, contact_info.email, summary, and work_experience.
- Jumbled Data: Check if any contact_info fields seem to contain other data (e.g., a phone number and email in the same string).
- Completeness: Check if the work_experience and education lists are populated. Check if the responsibilities (bullet points) under each job were successfully captured.

Your output must be in the specified JSON format.`,
                responseMimeType: "application/json",
                responseSchema: atsAuditSchema,
                temperature: 0.1,
            }
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as ATSAuditResult;
    } catch (error) {
        console.error("Error auditing ATS parse:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The audit was blocked due to safety concerns.");
        }
        throw new Error("Could not get a valid audit from the AI. The model may be overloaded or the input is invalid.");
    }
};
