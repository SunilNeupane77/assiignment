import { Request, Response, NextFunction } from 'express';
import { ResponseService } from './response.service.js';
import { ResponseHelper } from '../../helpers/index.js';
import { SUCCESS_MESSAGES } from '../../constants/index.js';

const responseService = new ResponseService();

export class ResponseController {
  async submitResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = (req.ip || req.socket.remoteAddress) as string;
      const response = await responseService.submitResponse(req.body, ipAddress);
      res.status(201).json(ResponseHelper.success(response, SUCCESS_MESSAGES.RESPONSE_SUBMITTED));
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const surveyId = String(req.params.surveyId);
      const analytics = await responseService.getAnalytics(surveyId);
      res.status(200).json(ResponseHelper.success(analytics));
    } catch (error) {
      next(error);
    }
  }

  async getResponsesBySurvey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const surveyId = String(req.params.surveyId);
      const responses = await responseService.getResponsesBySurvey(surveyId);
      res.status(200).json(ResponseHelper.success(responses));
    } catch (error) {
      next(error);
    }
  }

  async savePartialResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await responseService.savePartialResponse(req.body);
      res.status(200).json(ResponseHelper.success(response, 'Progress saved'));
    } catch (error) {
      next(error);
    }
  }

  async getPartialResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const surveyId = String(req.params.surveyId);
      const respondentId = String(req.params.respondentId);
      const response = await responseService.getPartialResponse(surveyId, respondentId);
      res.status(200).json(ResponseHelper.success(response));
    } catch (error) {
      next(error);
    }
  }

  async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const surveyId = String(req.params.surveyId);
      const csv = await responseService.exportToCSV(surveyId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=survey-${surveyId}-responses.csv`);
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}
