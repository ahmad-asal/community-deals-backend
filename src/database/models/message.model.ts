import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface Message {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    isRead?: boolean;
}

export type MessageCreationAttributes = Optional<Message, 'id' | 'isRead'>;

export class MessageModel
    extends Model<Message, MessageCreationAttributes>
    implements Message
{
    public id!: number;
    public conversationId!: number;
    public senderId!: number;
    public content!: string;
    public isRead?: boolean;
}

export default function (sequelize: Sequelize): typeof MessageModel {
    MessageModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            conversationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Conversations',
                    key: 'id',
                },
            },
            senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'Messages',
            sequelize,
            timestamps: true,
        },
    );

    return MessageModel;
}
