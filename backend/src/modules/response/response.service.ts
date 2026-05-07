import { ResponseModel } from './response.model.js';
import { SurveyModel } from '../survey/survey.model.js';
import { NotificationModel } from '../notification/notification.model.js';
import { IResponseService } from '../../interfaces/index.js';
import { CreateResponseDTO, SurveyResponse, SurveyAnalytics, QuestionAnalytics, Question, Answer } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { ValidationHelper } from '../../helpers/index.js';
import { ERROR_MESSAGES, HTTP_STATUS, SPAM_PREVENTION, RATING } from '../../constants/index.js';

export class ResponseService implements IResponseService {
  async submitResponse(data: CreateResponseDTO, ipAddress?: string): Promise<SurveyResponse> {
    if (!ValidationHelper.isValidObjectId(data.surveyId)) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const survey = await SurveyModel.findById(data.surveyId);
    if (!survey) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await this.checkSpam(data.surveyId, ipAddress);
    this.validateResponse(data, survey);

    const response = await ResponseModel.create({
      ...data,
      ipAddress,
      isPartial: false,
    });

    // Create notification
    const totalResponses = await ResponseModel.countDocuments({ surveyId: data.surveyId });
    const milestones = [10, 50, 100, 500, 1000];
    
    if (milestones.includes(totalResponses)) {
      await NotificationModel.create({
        userId: (survey as any).createdBy,
        surveyId: data.surveyId,
        message: `Your survey "${survey.title}" has reached ${totalResponses} responses!`,
        type: 'milestone',
      });
    }

    return this.toResponseDTO(response);
  }

  async getAnalytics(surveyId: string): Promise<SurveyAnalytics> {
    if (!ValidationHelper.isValidObjectId(surveyId)) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const survey = await SurveyModel.findById(surveyId);
    if (!survey) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const responses = await ResponseModel.find({ surveyId, isPartial: { $ne: true } });
    
    const analytics: SurveyAnalytics = {
      surveyId,
      totalResponses: responses.length,
      questions: [],
    };

    for (const question of survey.questions) {
      const questionAnalytics = this.calculateQuestionAnalytics(question, responses as any);
      analytics.questions.push(questionAnalytics);
    }

    return analytics;
  }

  async getResponsesBySurvey(surveyId: string): Promise<SurveyResponse[]> {
    if (!ValidationHelper.isValidObjectId(surveyId)) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const responses = await ResponseModel.find({ surveyId }).sort({ submittedAt: -1 });
    return responses.map(r => this.toResponseDTO(r));
  }

  async savePartialResponse(data: any): Promise<any> {
    const existing = await ResponseModel.findOne({
      surveyId: data.surveyId,
      respondentId: data.respondentId,
      isPartial: true
    });

    if (existing) {
      existing.answers = data.answers;
      existing.lastSavedAt = new Date();
      await existing.save();
      return this.toResponseDTO(existing);
    }

    const response = await ResponseModel.create({
      ...data,
      isPartial: true,
      lastSavedAt: new Date()
    });
    return this.toResponseDTO(response);
  }

  async getPartialResponse(surveyId: string, respondentId: string): Promise<any> {
    const response = await ResponseModel.findOne({
      surveyId,
      respondentId,
      isPartial: true
    });
    return response ? this.toResponseDTO(response) : null;
  }

  async exportToCSV(surveyId: string): Promise<string> {
    if (!ValidationHelper.isValidObjectId(surveyId)) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const survey = await SurveyModel.findById(surveyId);
    if (!survey) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const responses = await ResponseModel.find({ surveyId, isPartial: { $ne: true } });
    
    const headers = ['Response ID', 'Submitted At', ...survey.questions.map(q => q.question)];
    const rows = responses.map(r => {
      const row = [r._id.toString(), r.submittedAt?.toISOString() || ''];
      survey.questions.forEach(q => {
        const answer = r.answers.find((a: any) => a.questionId === q.id);
        row.push(answer ? (Array.isArray(answer.value) ? answer.value.join('; ') : String(answer.value)) : '');
      });
      return row;
    });

    return [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  private calculateQuestionAnalytics(question: Question, responses: SurveyResponse[]): QuestionAnalytics {
    const questionAnalytics: QuestionAnalytics = {
      questionId: question.id,
      question: question.question,
      type: question.type,
    };

    const answers = responses
      .map(r => r.answers.find((a: Answer) => a.questionId === question.id)?.value)
      .filter(Boolean);

    if (question.type === 'text') {
      questionAnalytics.responses = answers;
    } else if (question.type === 'rating') {
      const ratings = answers.filter(a => typeof a === 'number') as number[];
      questionAnalytics.average = ratings.length > 0 
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 100) / 100
        : 0;
      questionAnalytics.count = ratings.length;
    } else if (['radio', 'checkbox'].includes(question.type)) {
      const counts: Record<string, number> = {};
      answers.forEach(answer => {
        if (Array.isArray(answer)) {
          answer.forEach(opt => counts[opt] = (counts[opt] || 0) + 1);
        } else if (typeof answer === 'string') {
          counts[answer] = (counts[answer] || 0) + 1;
        }
      });
      questionAnalytics.counts = counts;
    }

    return questionAnalytics;
  }

  private validateResponse(data: CreateResponseDTO, survey: any): void {
    const answeredQuestions = new Set(data.answers.map(a => a.questionId));

    for (const question of survey.questions) {
      const shouldShow = ValidationHelper.shouldShowQuestion(question, data.answers);
      
      if (shouldShow && question.required && !answeredQuestions.has(question.id)) {
        throw new AppError(
          `${ERROR_MESSAGES.REQUIRED_QUESTION_NOT_ANSWERED}: "${question.question}"`,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const answer = data.answers.find(a => a.questionId === question.id);
      if (answer && shouldShow) {
        this.validateAnswer(answer.value, question);
      }
    }
  }

  private validateAnswer(value: any, question: Question): void {
    if (question.type === 'radio') {
      if (typeof value !== 'string' || !question.options?.includes(value)) {
        throw new AppError(
          `${ERROR_MESSAGES.INVALID_ANSWER} for question "${question.question}"`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    } else if (question.type === 'checkbox') {
      if (!Array.isArray(value) || !value.every(v => question.options?.includes(v))) {
        throw new AppError(
          `${ERROR_MESSAGES.INVALID_ANSWER} for question "${question.question}"`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    } else if (question.type === 'rating') {
      if (typeof value !== 'number' || value < RATING.MIN || value > RATING.MAX) {
        throw new AppError(
          `Rating must be between ${RATING.MIN} and ${RATING.MAX} for question "${question.question}"`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    } else if (question.type === 'text') {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new AppError(
          `Text answer required for question "${question.question}"`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
  }

  private async checkSpam(surveyId: string, ipAddress?: string): Promise<void> {
    if (!ipAddress) return;

    const recentSubmissions = await ResponseModel.countDocuments({
      surveyId,
      ipAddress,
      submittedAt: { $gte: new Date(Date.now() - SPAM_PREVENTION.TIME_WINDOW_MS) },
    });

    if (recentSubmissions >= SPAM_PREVENTION.MAX_SUBMISSIONS_PER_HOUR) {
      throw new AppError(ERROR_MESSAGES.TOO_MANY_SUBMISSIONS, HTTP_STATUS.TOO_MANY_REQUESTS);
    }
  }

  private toResponseDTO(doc: any): SurveyResponse {
    return {
      _id: doc._id.toString(),
      surveyId: doc.surveyId.toString(),
      answers: doc.answers,
      submittedAt: doc.submittedAt,
      ipAddress: doc.ipAddress,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
