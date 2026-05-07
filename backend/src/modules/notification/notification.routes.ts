import { Router } from 'express';
import { NotificationController } from './notification.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();
const notificationController = new NotificationController();

router.get('/', authenticate, notificationController.getNotifications.bind(notificationController));
router.get('/unread-count', authenticate, notificationController.getUnreadCount.bind(notificationController));
router.put('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController));
router.put('/read-all', authenticate, notificationController.markAllAsRead.bind(notificationController));

export default router;
