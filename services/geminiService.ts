
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

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
