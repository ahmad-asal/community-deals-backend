import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { CategoryModel } from '@/database/models/category.model';

interface DealAttributes {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    expiryDate: Date | null;
    status: 'In Review' | 'Approved' | 'rejected';
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DealCreationAttributes
    extends Optional<DealAttributes, 'id' | 'expiryDate'> {}

export class DealModel extends Model<DealAttributes, DealCreationAttributes> {
    id!: number;
    title!: string;
    description!: string;
    categoryId!: number;
    expiryDate!: Date | null;
    status!: 'In Review' | 'Approved' | 'Rejected';
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
            expiryDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('In Review', 'Approved', 'Rejected'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'deals',
        },
    );

    return DealModel;
}
