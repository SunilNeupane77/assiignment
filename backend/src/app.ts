import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes.js';
import surveyRoutes from './modules/survey/survey.routes.js';
import responseRoutes from './modules/response/response.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { RATE_LIMIT } from './constants/index.js';
import { ResponseHelper } from './helpers/index.js';

const app: Application = express();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];
    
    if (allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      const normalizedOrigin = origin?.replace(/\/$/, '');
      const isAllowed = allowedOrigins.some(allowed => 
        normalizedOrigin === allowed.replace(/\/$/, '')
      );
      callback(null, isAllowed);
    }
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json(ResponseHelper.success({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));
});

app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);

app.use(errorHandler);

export default app;
