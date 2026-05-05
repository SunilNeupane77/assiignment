import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ResponseHelper } from '../../helpers/index.js';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.status(200).json(ResponseHelper.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password, role } = req.body;
      await authService.register(username, password, role || 'user');
      res.status(201).json(ResponseHelper.success(null, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }
}
