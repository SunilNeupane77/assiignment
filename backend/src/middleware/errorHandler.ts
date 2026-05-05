import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/index.js';
import { ResponseHelper } from '../helpers/index.js';

// Custom error class for handling application-specific errors and a global error handling middleware
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware to catch and respond to errors in a consistent format
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ResponseHelper.error(err.message));
    return;
  }

  console.error('ERROR:', err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
    ResponseHelper.error(
      process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : err.message
    )
  );
};
