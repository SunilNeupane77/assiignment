import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from './auth.model.js';
import { AppError } from '../../middleware/errorHandler.js';
import { HTTP_STATUS } from '../../constants/index.js';

export class AuthService {
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return {
      token,
      user: { id: user._id, username: user.username, role: user.role },
    };
  }

  async register(username: string, password: string, role: 'admin' | 'user' = 'user'): Promise<void> {
    const exists = await UserModel.findOne({ username });
    if (exists) {
      throw new AppError('User already exists', HTTP_STATUS.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({ username, password: hashedPassword, role });
  }
}
