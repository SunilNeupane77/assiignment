import { Document } from 'mongoose';
import { Survey } from '../types/index.js';

export interface ISurveyDocument extends Omit<Survey, '_id'>, Document {}
