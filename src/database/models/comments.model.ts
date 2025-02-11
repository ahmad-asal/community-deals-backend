import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DealModel } from './deal.model';
import { UserModel } from './user.model';

// Define interface for Comment
export interface Comment {
    id: number;
    userId: number;
    dealId: number;
    content: string;
}

// Define creation attributes (optional 'id' for creation)
type commentCreationAttributes = Optional<Comment, 'id'>;

export class CommentModel
    extends Model<Comment, commentCreationAttributes>
    implements Comment
{
    public id!: number; // Required by the Comment interface
    public userId!: number; // Required by the Comment interface
    public dealId!: number; // Required by the Comment interface
    public content!: string; // Required by the Comment interface
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
                    model: 'users', // Ensure table name is correct
                    key: 'id',
                },
            },
            dealId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'deals', // Ensure table name is correct
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

    return CommentModel;
}
