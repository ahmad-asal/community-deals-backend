import { UserRole } from '@/interfaces/user.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { RoleModel } from './role.model';
import { UserModel } from './user.model';

export type UserRoleCreationAttributes = Optional<UserRole, 'id'>;

export class UserRoleModel
    extends Model<UserRole, UserRoleCreationAttributes>
    implements UserRole
{
    public id!: string;
    public userId!: number;
    public roleId!: number;
    public created_at: string | undefined;
    public updated_at: string | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserRoleModel {
    UserRoleModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            roleId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'role',
                    key: 'id',
                },
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'user_role',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );
    RoleModel.belongsToMany(UserModel, {
        foreignKey: 'roleId',
        // otherKey: 'userId',
        through: UserRoleModel,
        as: 'users',
    });
    UserModel.belongsToMany(RoleModel, {
        foreignKey: 'userId',
        // otherKey: 'roleId',
        through: UserRoleModel,
        as: 'roles',
    });
    return UserRoleModel;
}
