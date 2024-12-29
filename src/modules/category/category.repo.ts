import { DB } from '@/database';
import { CategoryModel } from '@/database/models/category.model';
import { Sequelize } from 'sequelize';

const repo = {
    getAll: async (): Promise<CategoryModel[] | null> => {
        try {
            // Fetch all categories from the Category table
            const categories = await DB.Categories.findAll({
                order: [
                    [Sequelize.literal('id = 0'), 'ASC'], // Treat id = 0 as the highest value
                    ['id', 'ASC'], // Order the rest by id ascending
                  ],
              });
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    },
    findByName: async (categoryName: string): Promise<CategoryModel | null> => {
        return await DB.Categories.findOne({
            where: { category_name: categoryName },
        });
    },
    addOne: async (categoryData: {
        category_name: string;
    }): Promise<CategoryModel> => {
        return await DB.Categories.create(categoryData);
    },
};

export default repo;
