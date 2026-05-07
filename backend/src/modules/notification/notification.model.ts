import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  surveyId: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['response', 'milestone', 'completion'], default: 'response' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const NotificationModel = mongoose.model('Notification', notificationSchema);
