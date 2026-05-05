import mongoose, { Schema } from 'mongoose';
import { ISurveyDocument } from '../../interfaces/index.js';

const conditionalLogicSchema = new Schema({
  dependsOn: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
}, { _id: false });

const questionSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'radio', 'checkbox', 'rating'], 
    required: true 
  },
  question: { type: String, required: true },
  options: [{ type: String }],
  required: { type: Boolean, default: false },
  order: { type: Number, required: true },
  conditionalLogic: conditionalLogicSchema,
}, { _id: false });

const surveySchema = new Schema<ISurveyDocument>({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  questions: { 
    type: [questionSchema], 
    required: true, 
    validate: [(arr: any[]) => arr.length > 0, 'At least one question required'] 
  },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  parentSurveyId: { type: Schema.Types.ObjectId, ref: 'Survey' },
}, { timestamps: true });

surveySchema.index({ createdAt: -1 });
surveySchema.index({ title: 'text', description: 'text' });

export const SurveyModel = mongoose.model<ISurveyDocument>('Survey', surveySchema);
