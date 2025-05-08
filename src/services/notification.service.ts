import { NotificationModel } from '@/database/models/notification.model';
import { UserModel } from '@/database/models/user.model';
import { Op } from 'sequelize';
import { io } from '@/server';

export class NotificationService {
    public notificationModel = NotificationModel;
    public userModel = UserModel;

    /**
     * Create a new notification
     */
    public async createNotification(
        userId: number,
        type: string,
        message: string,
        data: any = {}
    ) {
        const notification = await this.notificationModel.create({
            userId,
            type,
            message,
            data: JSON.stringify(data),
            isRead: false
        });

        // Get unread count
        const count = await this.notificationModel.count({
            where: {
                userId,
                isRead: false
            }
        });

        // Emit socket events for real-time notification
        io.to(`notifications-${userId}`).emit('newNotification', {
            notification,
            unreadCount: count
        });

        // Emit notification created event
        io.to(`notifications-${userId}`).emit('updateNotificationCount');

        return notification;
    }

    /**
     * Create a broadcast notification for all users
     */
    public async createBroadcastNotification(
        type: string,
        message: string,
        data: any = {}
    ) {
        // Get all users
        const users = await this.userModel.findAll({
            attributes: ['id']
        });

        // Create notifications for all users
        const notifications = await Promise.all(
            users.map(user => 
                this.notificationModel.create({
                    userId: Number(user.id),
                    type,
                    message,
                    data: JSON.stringify(data),
                    isRead: false
                })
            )
        );

        // Emit broadcast event
        io.emit('broadcastNotification', {
            type,
            message,
            data,
            timestamp: new Date()
        });

        return notifications;
    }

    /**
     * Create a notification for a specific group of users
     */
    public async createGroupNotification(
        userIds: number[],
        type: string,
        message: string,
        data: any = {}
    ) {
        // Create notifications for specified users
        const notifications = await Promise.all(
            userIds.map(userId =>
                this.notificationModel.create({
                    userId,
                    type,
                    message,
                    data: JSON.stringify(data),
                    isRead: false
                })
            )
        );

        // Emit to specific users' rooms
        userIds.forEach(userId => {
            io.to(`notifications-${userId}`).emit('newNotification', {
                type,
                message,
                data,
                timestamp: new Date()
            });
        });

        return notifications;
    }

    /**
     * Get user's notifications
     */
    public async getUserNotifications(
        userId: number,
        limit = 10,
        offset = 0
    ) {
        return await this.notificationModel.findAndCountAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
    }

    /**
     * Mark notification as read
     */
    public async markAsRead(notificationId: number) {
        const notification = await this.notificationModel.findOne({
            where: { id: notificationId }
        });

        if (notification) {
            await this.notificationModel.update(
                { isRead: true },
                { where: { id: notificationId } }
            );

            // Get updated unread count
            const count = await this.getUnreadCount(notification.userId);

            // Emit update event
            io.to(`notifications-${notification.userId}`).emit('updateNotificationCount');
        }
    }

    /**
     * Mark all notifications as read
     */
    public async markAllAsRead(userId: number) {
        await this.notificationModel.update(
            { isRead: true },
            { where: { userId, isRead: false } }
        );

        // Emit update event
        io.to(`notifications-${userId}`).emit('updateNotificationCount');
    }

    /**
     * Get unread notifications count
     */
    public async getUnreadCount(userId: number): Promise<number> {
        const count = await this.notificationModel.count({
            where: {
                userId,
                isRead: false
            }
        });
        return Number(count);
    }

    /**
     * Delete a notification
     */
    public async deleteNotification(notificationId: number) {
        const notification = await this.notificationModel.findOne({
            where: { id: notificationId }
        });

        if (notification) {
            const userId = notification.userId;
            
            // Delete the notification
            await this.notificationModel.destroy({
                where: { id: notificationId }
            });

            // Get updated unread count
            const count = await this.getUnreadCount(userId);

            // Emit update event with the new count
            io.to(`notifications-${userId}`).emit('updateNotificationCount');
            io.to(`notifications-${userId}`).emit('newNotification', {
                unreadCount: count
            });
        }
    }
} 