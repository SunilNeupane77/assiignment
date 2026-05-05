import { ApiResponse } from '../types/index.js';

export class ResponseHelper {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      status: 'success',
      data,
      message,
    };
  }

  static error(message: string, errors?: string[]): ApiResponse {
    return {
      status: 'error',
      message,
      errors,
    };
  }
}
