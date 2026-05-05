export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface SurveyResponse {
  _id?: string;
  surveyId: string;
  respondentId?: string;
  answers: Answer[];
  submittedAt?: Date;
  ipAddress?: string;
  isPartial?: boolean;
  lastSavedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateResponseDTO {
  surveyId: string;
  answers: Answer[];
}

export interface QuestionAnalytics {
  questionId: string;
  question: string;
  type: string;
  responses?: any[];
  average?: number;
  count?: number;
  counts?: Record<string, number>;
}

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  questions: QuestionAnalytics[];
}
