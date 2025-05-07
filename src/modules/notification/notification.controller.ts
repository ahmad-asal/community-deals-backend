import { NextFunction, Request, Response } from 'express';
import { NotificationService } from '@/services/notification.service';

export class NotificationController {
    public notificationService = new NotificationService();

    /**
     * Get user's notifications
     */
    public getNotifications = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { context: { userId } = {} } = req;
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;

            const { count, rows } = await this.notificationService.getUserNotifications(
                userId,
                limit,
                offset
            );

            // Parse the data field for each notification
            const notifications = rows.map(notification => ({
                ...notification.toJSON(),
                data: notification.data ? JSON.parse(notification.data) : null
            }));

            res.status(200).json({
                data: {
                    count,
                    rows: notifications
                },
                message: 'Notifications retrieved successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Mark notification as read
     */
    public markAsRead = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notificationId = Number(req.params.id);
            await this.notificationService.markAsRead(notificationId);

            res.status(200).json({
                message: 'Notification marked as read',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Mark all notifications as read
     */
    public markAllAsRead = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { context: { userId } = {} } = req;
            await this.notificationService.markAllAsRead(userId);

            res.status(200).json({
                message: 'All notifications marked as read',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get unread notifications count
     */
    public getUnreadCount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { context: { userId } = {} } = req;
            const count = await this.notificationService.getUnreadCount(userId);

            res.status(200).json({
                data: { count },
                message: 'Unread count retrieved successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete a notification
     */
    public deleteNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notificationId = Number(req.params.id);
            await this.notificationService.deleteNotification(notificationId);

            res.status(200).json({
                message: 'Notification deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a broadcast notification
     */
    public createBroadcastNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { type, message, data } = req.body;

            const notifications = await this.notificationService.createBroadcastNotification(
                type,
                message,
                data
            );

            res.status(201).json({
                data: notifications,
                message: 'Broadcast notification sent successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a group notification
     */
    public createGroupNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userIds, type, message, data } = req.body;

            const notifications = await this.notificationService.createGroupNotification(
                userIds,
                type,
                message,
                data
            );

            res.status(201).json({
                data: notifications,
                message: 'Group notification sent successfully',
            });
        } catch (error) {
            next(error);
        }
    };
} 