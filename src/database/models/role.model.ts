import { Role } from '@/interfaces/user.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
export type RoleCreationAttributes = Optional<Role, 'id' | 'name'>;

export class RoleModel
    extends Model<Role, RoleCreationAttributes>
    implements Role
{
    public id!: string;
    public name!: string;
    public created_at: string | undefined;
    public updated_at: string | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof RoleModel {
    RoleModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'role',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    return RoleModel;
}
