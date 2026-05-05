import { Router } from 'express';
import { SurveyController } from './survey.controller.js';
import { validate } from '../../middleware/validate.js';
import { createSurveySchema } from '../../utils/validation.js';
import { authenticate, isAdmin } from '../../middleware/auth.js';

const router = Router();
const surveyController = new SurveyController();

router.post(
  '/',
  surveyController.createSurvey.bind(surveyController)
);

router.get(
  '/stats/dashboard',
  authenticate,
  surveyController.getDashboardStats.bind(surveyController)
);

router.get(
  '/',
  surveyController.listSurveys.bind(surveyController)
);

router.get(
  '/:id',
  surveyController.getSurvey.bind(surveyController)
);

router.put(
  '/:id',
  authenticate,
  isAdmin,
  surveyController.updateSurvey.bind(surveyController)
);

router.delete(
  '/:id',
  authenticate,
  isAdmin,
  surveyController.deleteSurvey.bind(surveyController)
);

export default router;
