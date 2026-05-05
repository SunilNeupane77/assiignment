export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  SURVEY_NOT_FOUND: 'Survey not found',
  INVALID_SURVEY_STRUCTURE: 'Invalid survey structure',
  DUPLICATE_QUESTION_ID: 'Duplicate question ID found',
  REQUIRED_QUESTION_NOT_ANSWERED: 'Required question not answered',
  INVALID_ANSWER: 'Invalid answer provided',
  TOO_MANY_SUBMISSIONS: 'Too many submissions. Please try again later.',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INVALID_TOKEN: 'Invalid token',
  ADMIN_ACCESS_REQUIRED: 'Admin access required',
  VALIDATION_ERROR: 'Validation error',
} as const;

export const SUCCESS_MESSAGES = {
  SURVEY_CREATED: 'Survey created successfully',
  SURVEY_UPDATED: 'Survey updated successfully',
  SURVEY_DELETED: 'Survey deleted successfully',
  RESPONSE_SUBMITTED: 'Response submitted successfully',
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 100,
} as const;

export const SPAM_PREVENTION = {
  MAX_SUBMISSIONS_PER_HOUR: 3,
  TIME_WINDOW_MS: 60 * 60 * 1000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const RATING = {
  MIN: 1,
  MAX: 5,
} as const;
