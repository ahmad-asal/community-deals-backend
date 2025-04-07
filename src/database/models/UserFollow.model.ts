import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserModel } from './user.model';

export interface UserFollow {
    id: number;
    followerId: number;
    followingId: number;
    createdAt?: Date | undefined;
    updatedA?: Date | undefined;
}
// Define an interface for creation attributes
// This allows creating without an id
export type UserFollowCreationAttributes = Optional<UserFollow, 'id'>;

export class UserFollowModel
    extends Model<UserFollow, UserFollowCreationAttributes>
    implements UserFollow
{
    public id!: number;
    public followerId!: number;
    public followingId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserFollowModel {
    UserFollowModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            followerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: UserModel,
                    key: 'id',
                },
            },
            followingId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: UserModel,
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'user_follows',
            tableName: 'user_follows',
            timestamps: true,
        },
    );

    // Define associations
    UserModel.belongsToMany(UserModel, {
        through: UserFollowModel,
        as: 'followers',
        foreignKey: 'followingId',
        otherKey: 'followerId',
    });

    UserModel.belongsToMany(UserModel, {
        through: UserFollowModel,
        as: 'following',
        foreignKey: 'followerId',
        otherKey: 'followingId',
    });

    return UserFollowModel;
}
