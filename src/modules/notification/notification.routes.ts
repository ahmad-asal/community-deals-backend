import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const notificationController = new NotificationController();
const notificationRouter = Router();

// Get user's notifications
notificationRouter.get(
    '/',
    authMiddleware,
    notificationController.getNotifications
);

// Mark notification as read
notificationRouter.patch(
    '/:id/read',
    authMiddleware,
    notificationController.markAsRead
);

// Mark all notifications as read
notificationRouter.patch(
    '/read-all',
    authMiddleware,
    notificationController.markAllAsRead
);

// Get unread notifications count
notificationRouter.get(
    '/unread-count',
    authMiddleware,
    notificationController.getUnreadCount
);

// Delete a notification
notificationRouter.delete(
    '/:id',
    authMiddleware,
    notificationController.deleteNotification
);

// Create broadcast notification (admin only)
notificationRouter.post(
    '/broadcast',
    authMiddleware,
    notificationController.createBroadcastNotification
);

// Create group notification
notificationRouter.post(
    '/group',
    authMiddleware,
    notificationController.createGroupNotification
);

export default notificationRouter; 