import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserModel } from './user.model';
import { MessageModel } from './message.model';

export interface Conversation {
    id: number;
    user1Id: number;
    user2Id: number;
    lastMessage?: string;
    lastMessageAt?: Date;
    deletedBy?: any;
}

export type ConversationCreationAttributes = Optional<
    Conversation,
    'id' | 'lastMessage' | 'lastMessageAt'
>;

export class ConversationModel
    extends Model<Conversation, ConversationCreationAttributes>
    implements Conversation
{
    public id!: number;
    public user1Id!: number;
    public user2Id!: number;
    public lastMessage?: string;
    public lastMessageAt?: Date;
    public deletedBy?: any;
}

export default function (sequelize: Sequelize): typeof ConversationModel {
    ConversationModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user1Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            user2Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            deletedBy: {
                type: DataTypes.JSON, // Store deleted user IDs in an array
                allowNull: true,
                defaultValue: [],
            },
            lastMessage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lastMessageAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: 'Conversations',
            sequelize,
            timestamps: true,
        },
    );

    return ConversationModel;
}
