import { CreateResponseDTO, SurveyResponse, SurveyAnalytics } from '../types/index.js';

export interface IResponseService {
  submitResponse(data: CreateResponseDTO, ipAddress?: string): Promise<SurveyResponse>;
  getAnalytics(surveyId: string): Promise<SurveyAnalytics>;
  getResponsesBySurvey(surveyId: string): Promise<SurveyResponse[]>;
}
