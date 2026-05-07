import { NotificationModel } from './notification.model.js';

export class NotificationService {
  async createNotification(data: any): Promise<any> {
    const notification = await NotificationModel.create(data);
    return notification;
  }

  async getUserNotifications(userId: string, unreadOnly = false): Promise<any[]> {
    const filter: any = { userId };
    if (unreadOnly) filter.isRead = false;
    
    const notifications = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('surveyId', 'title');
    
    return notifications;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({ userId, isRead: false });
  }
}
