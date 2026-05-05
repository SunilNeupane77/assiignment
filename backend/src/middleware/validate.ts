import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/index.js';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`);
        next(new AppError(ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST));
      } else {
        next(error);
      }
    }
  };
};
