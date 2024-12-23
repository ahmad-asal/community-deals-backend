import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { CategoryModel } from './category.model';
import { DealModel } from './deal.model';

// Define associations
DealModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId',
    as: 'category',
});
CategoryModel.hasMany(DealModel, { foreignKey: 'categoryId' });

export { CategoryModel, DealModel };
