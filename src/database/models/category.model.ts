import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface Category {
    id: number;
    category_name: string;
}

export type CategoryCreationAttributes = Optional<Category, 'id'>;

export class CategoryModel
    extends Model<Category, CategoryCreationAttributes>
    implements Category
{
    public id!: number;
    public category_name!: string;
}

export default function (sequelize: Sequelize): typeof CategoryModel {
    CategoryModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            category_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                comment: 'Name of the category',
            },
        },
        {
            tableName: 'categories',
            sequelize,
            timestamps: false,
        },
    );

    return CategoryModel;
}
