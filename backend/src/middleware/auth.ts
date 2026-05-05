import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { JwtPayload } from '../types/index.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/index.js';

// Middleware for authenticating users using JWT tokens and checking admin access
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware to authenticate users based on JWT tokens
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

// Middleware to check if the authenticated user has admin access
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    throw new AppError(ERROR_MESSAGES.ADMIN_ACCESS_REQUIRED, HTTP_STATUS.FORBIDDEN);
  }
  next();
};
