import { rolesList, User, userStatus } from '@/interfaces/user.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type UserCreationAttributes = Optional<User, 'id' | 'username'>;

export class UserModel
    extends Model<User, UserCreationAttributes>
    implements User
{
    public id!: string;
    public email!: string;
    public name!: string;
    public username!: string;
    public password!: string;
    public jobTitle!: string;
    public companyName!: string;
    public phoneNumber!: string;
    public address!: string;
    public profileImg!: string;
    public status!: userStatus;
    roles: rolesList | undefined;

    public created_at: string | undefined;
    public updated_at: string | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            username: {
                allowNull: true,
                type: DataTypes.STRING,
                unique: true,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING(255),
            },
            status: {
                allowNull: false,
                type: DataTypes.ENUM(
                    'pending',
                    'active',
                    'suspended',
                    'deleted',
                ),
            },
            jobTitle: {
                allowNull: true,
                type: DataTypes.STRING(255),
            },
            companyName: {
                allowNull: true,
                type: DataTypes.STRING(255),
            },
            phoneNumber: {
                allowNull: true,
                type: DataTypes.STRING(255),
            },
            address: {
                allowNull: true,
                type: DataTypes.STRING(255),
            },
            profileImg: {
                allowNull: true,
                type: DataTypes.STRING(255),
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'user',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    return UserModel;
}
