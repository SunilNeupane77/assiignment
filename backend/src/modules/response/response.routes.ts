import { Router } from 'express';
import { ResponseController } from './response.controller.js';
import { validate } from '../../middleware/validate.js';
import { createResponseSchema } from '../../utils/validation.js';
import { authenticate, isAdmin } from '../../middleware/auth.js';

const router = Router();
const responseController = new ResponseController();

router.post(
  '/',
  validate(createResponseSchema),
  responseController.submitResponse.bind(responseController)
);

router.post(
  '/partial',
  responseController.savePartialResponse.bind(responseController)
);

router.get(
  '/partial/:surveyId/:respondentId',
  responseController.getPartialResponse.bind(responseController)
);

router.get(
  '/analytics/:surveyId',
  authenticate,
  responseController.getAnalytics.bind(responseController)
);

router.get(
  '/survey/:surveyId',
  authenticate,
  responseController.getResponsesBySurvey.bind(responseController)
);

router.get(
  '/export/:surveyId',
  authenticate,
  responseController.exportCSV.bind(responseController)
);

export default router;
