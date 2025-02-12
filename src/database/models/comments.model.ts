import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DealModel } from './deal.model';
import { UserModel } from './user.model';

export interface Comment {
    id: number;
    userId: number;
    dealId: number;
    content: string;
}

type commentCreationAttributes = Optional<Comment, 'id'>;

export class CommentModel
    extends Model<Comment, commentCreationAttributes>
    implements Comment
{
    public id!: number;
    public userId!: number;
    public dealId!: number;
    public content!: string;
}

export default function (sequelize: Sequelize): typeof CommentModel {
    CommentModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            dealId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'deals',
                    key: 'id',
                },
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'comments',
            sequelize,
            timestamps: true,
        },
    );

    // Relationships: A comment belongs to a deal and a user
    CommentModel.belongsTo(UserModel, {
        foreignKey: 'userId',
        as: 'author',
    });
    CommentModel.belongsTo(DealModel, {
        foreignKey: 'dealId',
        as: 'deal',
    });
    DealModel.hasMany(CommentModel, {
        foreignKey: 'dealId',
        as: 'comments',
    });

    return CommentModel;
}
