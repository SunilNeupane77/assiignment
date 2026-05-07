import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service.js';
import { ResponseHelper } from '../../helpers/index.js';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications = await notificationService.getUserNotifications(userId, unreadOnly);
      res.status(200).json(ResponseHelper.success(notifications));
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await notificationService.markAsRead(id, userId);
      res.status(200).json(ResponseHelper.success(null, 'Marked as read'));
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      await notificationService.markAllAsRead(userId);
      res.status(200).json(ResponseHelper.success(null, 'All marked as read'));
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const count = await notificationService.getUnreadCount(userId);
      res.status(200).json(ResponseHelper.success({ count }));
    } catch (error) {
      next(error);
    }
  }
}
