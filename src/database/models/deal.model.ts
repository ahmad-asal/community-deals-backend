import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { CategoryModel } from '@/database/models/category.model';
import {
    Deal,
    DealAudienceType,
    DealStatuses,
    DealTypes,
} from '@/interfaces/deal.interface';
import { UserModel } from '@/database/models/user.model';
import { CityModel } from './city.model';

type DealCreationAttributes = Optional<
    Deal,
    'id' | 'expiryDate' | 'type' | 'audience'
>;

export class DealModel extends Model<Deal, DealCreationAttributes> {
    id!: number;
    title!: string;
    description!: string;
    categoryId!: number;
    autherId!: number;
    expiryDate!: Date | null;
    status!: DealStatuses;
    type!: DealTypes;
    audience!: DealAudienceType;
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
            type: {
                type: DataTypes.ENUM('I Want to', 'I Need to', 'Other'),
                allowNull: false,
                defaultValue: 'Other',
            },
            audience: {
                type: DataTypes.ENUM('public', 'friends', 'custom'),
                allowNull: false,
                defaultValue: 'public',
            },
        },
        {
            sequelize,
            modelName: 'deals',
        },
    );
    UserModel.hasMany(DealModel, {
        foreignKey: 'autherId',
        as: 'deals',
    });
    DealModel.belongsTo(UserModel, { foreignKey: 'autherId', as: 'auther' });

    return DealModel;
}
