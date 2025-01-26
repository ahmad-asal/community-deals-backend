import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { CategoryModel } from '@/database/models/category.model';
import { Deal, DealStatuses } from '@/interfaces/deal.interface';
import { UserModel } from '@/database/models/user.model';

type DealCreationAttributes = Optional<Deal, 'id' | 'expiryDate'>;

export class DealModel extends Model<Deal, DealCreationAttributes> {
    id!: number;
    title!: string;
    description!: string;
    categoryId!: number;
    autherId!: number;
    expiryDate!: Date | null;
    status!: DealStatuses;
}

export default function (sequelize: Sequelize): typeof DealModel {
    DealModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: CategoryModel,
                    key: 'id',
                },
            },
            autherId: {
                type: DataTypes.INTEGER,
                references: {
                    model: UserModel,
                    key: 'id',
                },
            },
            expiryDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM(
                    'In Review',
                    'Approved',
                    'Rejected',
                    'Deleted',
                ),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'deals',
        },
    );
    UserModel.hasMany(DealModel, {
        foreignKey: 'autherId',
    });
    DealModel.belongsTo(UserModel, { as: 'auther' });
    return DealModel;
}
