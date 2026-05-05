import mongoose, { Schema } from 'mongoose';
import { IResponseDocument } from '../../interfaces/index.js';

const answerSchema = new Schema({
  questionId: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
}, { _id: false });

const responseSchema = new Schema<IResponseDocument>({
  surveyId: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
  respondentId: { type: String },
  answers: { 
    type: [answerSchema], 
    required: false
  },
  submittedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  isPartial: { type: Boolean, default: false },
  lastSavedAt: { type: Date, default: Date.now },
}, { timestamps: true });

responseSchema.index({ surveyId: 1, submittedAt: -1 });
responseSchema.index({ respondentId: 1, surveyId: 1 });
responseSchema.index({ ipAddress: 1, surveyId: 1, submittedAt: -1 });

export const ResponseModel = mongoose.model<IResponseDocument>('Response', responseSchema);
