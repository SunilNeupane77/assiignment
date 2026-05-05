import mongoose, { Schema } from 'mongoose';

export interface IUserDocument extends mongoose.Document {
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
}, { timestamps: true });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
