import { CreateSurveyDTO, UpdateSurveyDTO, Survey } from '../types/index.js';
import { PaginatedResponse, QueryOptions } from '../types/index.js';

export interface ISurveyService {
  createSurvey(data: CreateSurveyDTO): Promise<Survey>;
  getSurveyById(id: string): Promise<Survey>;
  listSurveys(options: QueryOptions): Promise<PaginatedResponse<Survey>>;
  updateSurvey(id: string, data: UpdateSurveyDTO): Promise<Survey>;
  deleteSurvey(id: string): Promise<void>;
}
