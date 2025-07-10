import { FiveWhysAnalysis, WhyQuestion, AnalysisState, AnalysisResult } from './types.js';

export class FiveWhysAnalyzer {
  private state: AnalysisState = {
    currentAnalysis: null,
    currentLevel: 0,
    isWaitingForAnswer: false
  };

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateWhyQuestion(level: number, previousAnswer?: string): string {
    const baseQuestions = [
      "Why did this problem occur?",
      "Why did this happen?",
      "What caused this situation?",
      "Why did this underlying cause occur?",
      "What is the root cause of this issue?"
    ];

    if (level <= baseQuestions.length) {
      return baseQuestions[level - 1];
    }

    return `Why did "${previousAnswer}" occur?`;
  }

  startAnalysis(problem: string): AnalysisResult {
    if (this.state.currentAnalysis && !this.state.currentAnalysis.isComplete) {
      return {
        success: false,
        message: "An analysis is already in progress. Please complete it or reset before starting a new one."
      };
    }

    const analysis: FiveWhysAnalysis = {
      id: this.generateId(),
      problem: problem.trim(),
      questions: [],
      startTime: new Date(),
      isComplete: false
    };

    this.state.currentAnalysis = analysis;
    this.state.currentLevel = 1;
    this.state.isWaitingForAnswer = true;

    const firstQuestion = this.generateWhyQuestion(1);
    analysis.questions.push({
      level: 1,
      question: firstQuestion
    });

    return {
      success: true,
      message: "Analysis started successfully. Please answer the first 'why' question.",
      analysis,
      nextQuestion: firstQuestion
    };
  }

  answerWhy(answer: string): AnalysisResult {
    if (!this.state.currentAnalysis) {
      return {
        success: false,
        message: "No analysis in progress. Please start an analysis first."
      };
    }

    if (!this.state.isWaitingForAnswer) {
      return {
        success: false,
        message: "Not waiting for an answer. The analysis may be complete."
      };
    }

    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer) {
      return {
        success: false,
        message: "Please provide a meaningful answer."
      };
    }

    const currentQuestion = this.state.currentAnalysis.questions[this.state.currentLevel - 1];
    if (!currentQuestion) {
      return {
        success: false,
        message: "Error: Current question not found."
      };
    }

    currentQuestion.answer = trimmedAnswer;

    if (this.state.currentLevel >= 5) {
      this.state.currentAnalysis.isComplete = true;
      this.state.currentAnalysis.endTime = new Date();
      this.state.currentAnalysis.rootCause = trimmedAnswer;
      this.state.isWaitingForAnswer = false;

      return {
        success: true,
        message: "Analysis complete! You have identified the root cause.",
        analysis: this.state.currentAnalysis
      };
    }

    this.state.currentLevel++;
    const nextQuestion = this.generateWhyQuestion(this.state.currentLevel, trimmedAnswer);
    
    this.state.currentAnalysis.questions.push({
      level: this.state.currentLevel,
      question: nextQuestion
    });

    return {
      success: true,
      message: `Answer recorded. Please answer the next 'why' question (${this.state.currentLevel}/5).`,
      analysis: this.state.currentAnalysis,
      nextQuestion
    };
  }

  getCurrentState(): AnalysisResult {
    if (!this.state.currentAnalysis) {
      return {
        success: false,
        message: "No analysis in progress."
      };
    }

    const currentQuestion = this.state.isWaitingForAnswer 
      ? this.state.currentAnalysis.questions[this.state.currentLevel - 1]?.question
      : undefined;

    return {
      success: true,
      message: this.state.currentAnalysis.isComplete 
        ? "Analysis is complete."
        : `Analysis in progress (${this.state.currentLevel}/5). ${this.state.isWaitingForAnswer ? "Waiting for answer." : ""}`,
      analysis: this.state.currentAnalysis,
      nextQuestion: currentQuestion
    };
  }

  resetAnalysis(): AnalysisResult {
    this.state = {
      currentAnalysis: null,
      currentLevel: 0,
      isWaitingForAnswer: false
    };

    return {
      success: true,
      message: "Analysis reset successfully. You can start a new analysis."
    };
  }

  exportAnalysis(format: 'markdown' | 'json' | 'text' = 'markdown'): AnalysisResult {
    if (!this.state.currentAnalysis) {
      return {
        success: false,
        message: "No analysis to export."
      };
    }

    const analysis = this.state.currentAnalysis;
    let exportData: string;

    switch (format) {
      case 'json':
        exportData = JSON.stringify(analysis, null, 2);
        break;
      
      case 'text':
        exportData = this.formatAsText(analysis);
        break;
      
      case 'markdown':
      default:
        exportData = this.formatAsMarkdown(analysis);
        break;
    }

    return {
      success: true,
      message: `Analysis exported as ${format}.`,
      analysis: {
        ...analysis,
        exportData
      } as any
    };
  }

  private formatAsMarkdown(analysis: FiveWhysAnalysis): string {
    let md = `# 5 Whys Analysis\n\n`;
    md += `**Problem:** ${analysis.problem}\n\n`;
    md += `**Started:** ${analysis.startTime.toLocaleString()}\n`;
    
    if (analysis.endTime) {
      md += `**Completed:** ${analysis.endTime.toLocaleString()}\n`;
    }
    
    md += `**Status:** ${analysis.isComplete ? 'Complete' : 'In Progress'}\n\n`;
    
    md += `## Analysis Steps\n\n`;
    
    analysis.questions.forEach((q, index) => {
      md += `### ${index + 1}. ${q.question}\n`;
      if (q.answer) {
        md += `**Answer:** ${q.answer}\n\n`;
      } else {
        md += `*Awaiting answer...*\n\n`;
      }
    });

    if (analysis.rootCause) {
      md += `## Root Cause\n\n`;
      md += `**${analysis.rootCause}**\n\n`;
    }

    return md;
  }

  private formatAsText(analysis: FiveWhysAnalysis): string {
    let text = `5 WHYS ANALYSIS\n`;
    text += `===============\n\n`;
    text += `Problem: ${analysis.problem}\n`;
    text += `Started: ${analysis.startTime.toLocaleString()}\n`;
    
    if (analysis.endTime) {
      text += `Completed: ${analysis.endTime.toLocaleString()}\n`;
    }
    
    text += `Status: ${analysis.isComplete ? 'Complete' : 'In Progress'}\n\n`;
    
    text += `ANALYSIS STEPS\n`;
    text += `--------------\n\n`;
    
    analysis.questions.forEach((q, index) => {
      text += `${index + 1}. ${q.question}\n`;
      if (q.answer) {
        text += `   Answer: ${q.answer}\n\n`;
      } else {
        text += `   Awaiting answer...\n\n`;
      }
    });

    if (analysis.rootCause) {
      text += `ROOT CAUSE\n`;
      text += `----------\n`;
      text += `${analysis.rootCause}\n\n`;
    }

    return text;
  }
}