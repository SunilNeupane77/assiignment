import { Question, Answer } from '../types/index.js';

export class ValidationHelper {
  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  static shouldShowQuestion(question: Question, answers: Answer[]): boolean {
    if (!question.conditionalLogic) return true;

    const dependentAnswer = answers.find(a => a.questionId === question.conditionalLogic!.dependsOn);
    if (!dependentAnswer) return false;

    const expectedValue = question.conditionalLogic.value;
    const actualValue = dependentAnswer.value;

    if (Array.isArray(expectedValue)) {
      return Array.isArray(actualValue)
        ? expectedValue.some(v => actualValue.includes(v))
        : expectedValue.includes(actualValue as string);
    }

    return Array.isArray(actualValue)
      ? actualValue.includes(expectedValue as string)
      : actualValue === expectedValue;
  }

  static validateQuestionIds(questions: Question[]): void {
    const questionIds = new Set<string>();
    
    for (const question of questions) {
      if (questionIds.has(question.id)) {
        throw new Error(`Duplicate question ID: ${question.id}`);
      }
      questionIds.add(question.id);
    }
  }

  static validateConditionalLogic(questions: Question[]): void {
    const questionIds = new Set(questions.map(q => q.id));
    
    for (const question of questions) {
      if (question.conditionalLogic) {
        if (!questionIds.has(question.conditionalLogic.dependsOn)) {
          throw new Error(`Question "${question.question}" depends on non-existent question`);
        }
      }
    }
  }
}
