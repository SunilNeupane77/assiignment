import { z } from 'zod';

export const questionTypeSchema = z.enum(['text', 'radio', 'checkbox', 'rating']);

export const conditionalLogicSchema = z.object({
  dependsOn: z.string(),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
}).optional();

export const questionSchema = z.object({
  id: z.string(),
  type: questionTypeSchema,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  order: z.number().int().min(0),
  conditionalLogic: conditionalLogicSchema,
});

export const createSurveySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  questions: z.array(questionSchema).min(1),
});

export const answerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.number()]),
});

export const createResponseSchema = z.object({
  surveyId: z.string(),
  answers: z.array(answerSchema).min(1),
});

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type Question = z.infer<typeof questionSchema>;
export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
export type Answer = z.infer<typeof answerSchema>;
export type CreateResponseInput = z.infer<typeof createResponseSchema>;
