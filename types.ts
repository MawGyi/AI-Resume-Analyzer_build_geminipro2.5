
export interface AnalysisResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestedKeywords: string[];
  formattingFeedback: string;
}
