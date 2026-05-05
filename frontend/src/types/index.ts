export interface Question {
  id: string;
  type: 'text' | 'radio' | 'checkbox' | 'rating';
  question: string;
  required: boolean;
  options?: string[];
  conditionalLogic?: {
    dependsOn: string;
    value: string;
  };
}

export interface Survey {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SurveyResponse {
  _id?: string;
  id?: string;
  surveyId: string;
  respondentId?: string;
  answers: { questionId: string; value: string | string[] | number }[];
  submittedAt?: string;
}

export interface QuestionAnalytics {
  questionId: string;
  question: string;
  type: string;
  responses?: string[];
  counts?: Record<string, number>;
  average?: number;
  count?: number;
}

export interface Analytics {
  surveyId: string;
  totalResponses: number;
  questions: QuestionAnalytics[];
}
