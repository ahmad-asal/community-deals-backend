import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserModel } from './user.model';

export interface Notification {
    id: number;
    userId: number;
    type: string;
    message: string;
    data: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type NotificationCreationAttributes = Optional<Notification, 'id'>;

export class NotificationModel extends Model<Notification, NotificationCreationAttributes> implements Notification {
    public id!: number;
    public userId!: number;
    public type!: string;
    public message!: string;
    public data!: string;
    public isRead!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof NotificationModel {
    NotificationModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: UserModel,
                    key: 'id',
                },
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            data: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'notification',
            tableName: 'notifications',
            timestamps: true,
        }
    );

    return NotificationModel;
} 