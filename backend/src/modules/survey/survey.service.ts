import { SurveyModel } from './survey.model.js';
import { ResponseModel } from '../response/response.model.js';
import { ISurveyService } from '../../interfaces/index.js';
import { CreateSurveyDTO, UpdateSurveyDTO, Survey, PaginatedResponse, QueryOptions } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { ValidationHelper } from '../../helpers/index.js';
import { ERROR_MESSAGES, HTTP_STATUS, PAGINATION } from '../../constants/index.js';

export class SurveyService implements ISurveyService {
  async createSurvey(data: CreateSurveyDTO): Promise<Survey> {
    this.validateSurveyStructure(data);
    const survey = await SurveyModel.create({ ...data, version: 1 });
    return this.toSurveyDTO(survey);
  }

  async createSurveyVersion(id: string, data: UpdateSurveyDTO): Promise<Survey> {
    const original = await SurveyModel.findById(id);
    if (!original) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const newVersion = await SurveyModel.create({
      ...data,
      version: (original.version || 1) + 1,
      parentSurveyId: original.parentSurveyId || String(original._id),
      isActive: true
    });

    await SurveyModel.findByIdAndUpdate(id, { isActive: false });
    return this.toSurveyDTO(newVersion);
  }

  async getSurveyById(id: string): Promise<Survey> {
    if (!ValidationHelper.isValidObjectId(id)) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const survey = await SurveyModel.findById(id);
    if (!survey) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return this.toSurveyDTO(survey);
  }

  async listSurveys(options: QueryOptions): Promise<PaginatedResponse<Survey>> {
    const page = options.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(options.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const sortOrder = options.order === 'asc' ? 1 : -1;
    const sortField = options.sort || 'createdAt';

    const [surveys, total] = await Promise.all([
      SurveyModel.find().sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
      SurveyModel.countDocuments(),
    ]);

    return {
      data: surveys.map((s: any) => this.toSurveyDTO(s)),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async updateSurvey(id: string, data: UpdateSurveyDTO): Promise<Survey> {
    if (!ValidationHelper.isValidObjectId(id)) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (data.questions) {
      this.validateSurveyStructure({ title: '', questions: data.questions });
    }

    const survey = await SurveyModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!survey) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return this.toSurveyDTO(survey);
  }

  async deleteSurvey(id: string): Promise<void> {
    if (!ValidationHelper.isValidObjectId(id)) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const survey = await SurveyModel.findByIdAndDelete(id);
    if (!survey) {
      throw new AppError(ERROR_MESSAGES.SURVEY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    
    await ResponseModel.deleteMany({ surveyId: id });
  }

  async getDashboardStats(): Promise<any> {
    const [totalSurveys, totalResponses] = await Promise.all([
      SurveyModel.countDocuments(),
      ResponseModel.countDocuments(),
    ]);

    return {
      totalSurveys,
      totalResponses,
    };
  }

  private validateSurveyStructure(data: CreateSurveyDTO | { title: string; questions: any[] }): void {
    ValidationHelper.validateQuestionIds(data.questions);
    ValidationHelper.validateConditionalLogic(data.questions);

    for (const question of data.questions) {
      if (['radio', 'checkbox'].includes(question.type) && (!question.options || question.options.length === 0)) {
        throw new AppError(`Question "${question.question}" requires options`, HTTP_STATUS.BAD_REQUEST);
      }

      if (question.type === 'rating' && question.options) {
        throw new AppError(`Rating question "${question.question}" should not have options`, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  private toSurveyDTO(doc: any): Survey {
    return {
      _id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      questions: doc.questions,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
