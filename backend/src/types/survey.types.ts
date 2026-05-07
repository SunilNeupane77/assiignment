export type QuestionType = 'text' | 'radio' | 'checkbox' | 'rating';

export interface ConditionalLogic {
  dependsOn: string;
  value: string | number | string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required: boolean;
  order: number;
  conditionalLogic?: ConditionalLogic;
}

export interface Survey {
  _id?: string;
  title: string;
  description?: string;
  questions: Question[];
  version?: number;
  isActive?: boolean;
  parentSurveyId?: string;
  startDate?: Date;
  expiryDate?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSurveyDTO {
  title: string;
  description?: string;
  questions: Question[];
  startDate?: Date;
  expiryDate?: Date;
}

export interface UpdateSurveyDTO {
  title?: string;
  description?: string;
  questions?: Question[];
  startDate?: Date;
  expiryDate?: Date;
}
