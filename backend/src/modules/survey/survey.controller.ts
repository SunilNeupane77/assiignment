import { Request, Response, NextFunction } from 'express';
import { SurveyService } from './survey.service.js';
import { ResponseHelper } from '../../helpers/index.js';
import { SUCCESS_MESSAGES, PAGINATION } from '../../constants/index.js';

const surveyService = new SurveyService();

export class SurveyController {
  async createSurvey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const survey = await surveyService.createSurvey({ ...req.body, createdBy: userId });
      res.status(201).json(ResponseHelper.success(survey, SUCCESS_MESSAGES.SURVEY_CREATED));
    } catch (error) {
      next(error);
    }
  }

  async getSurvey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const survey = await surveyService.getSurveyById(id);
      res.status(200).json(ResponseHelper.success(survey));
    } catch (error) {
      next(error);
    }
  }

  async listSurveys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = {
        page: parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE,
        limit: Math.min(parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT),
        sort: req.query.sort as string,
        order: (req.query.order as 'asc' | 'desc') || 'desc',
      };
      const result = await surveyService.listSurveys(options);
      res.status(200).json(ResponseHelper.success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateSurvey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const survey = await surveyService.updateSurvey(id, req.body);
      res.status(200).json(ResponseHelper.success(survey, SUCCESS_MESSAGES.SURVEY_UPDATED));
    } catch (error) {
      next(error);
    }
  }

  async deleteSurvey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await surveyService.deleteSurvey(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await surveyService.getDashboardStats();
      res.status(200).json(ResponseHelper.success(stats));
    } catch (error) {
      next(error);
    }
  }
}
