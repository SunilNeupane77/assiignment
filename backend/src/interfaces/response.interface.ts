import { Document } from 'mongoose';
import { SurveyResponse } from '../types/index.js';

export interface IResponseDocument extends Omit<SurveyResponse, '_id' | 'surveyId'>, Document {
  surveyId: any;
}
