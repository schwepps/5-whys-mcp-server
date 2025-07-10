export interface WhyQuestion {
  level: number;
  question: string;
  answer?: string;
}

export interface FiveWhysAnalysis {
  id: string;
  problem: string;
  questions: WhyQuestion[];
  startTime: Date;
  endTime?: Date;
  isComplete: boolean;
  rootCause?: string;
}

export interface AnalysisState {
  currentAnalysis: FiveWhysAnalysis | null;
  currentLevel: number;
  isWaitingForAnswer: boolean;
}

export interface ExportFormat {
  format: 'markdown' | 'json' | 'text';
}

export interface AnalysisResult {
  success: boolean;
  message: string;
  analysis?: FiveWhysAnalysis;
  nextQuestion?: string;
}