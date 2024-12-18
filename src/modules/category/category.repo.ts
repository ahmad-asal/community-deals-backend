import { DB } from '@/database';
import { CategoryModel } from '@/database/models/category.model';


const repo = {
    allCategories: async (): Promise<CategoryModel[] | null> => {
        try {
            // Fetch all categories from the Category table
            const categories = await DB.Categories.findAll();
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    },
     findCategoryByName : async (categoryName: string): Promise<CategoryModel | null> => {
        return await DB.Categories.findOne({
            where: { category_name: categoryName },
        });
    },
    addCategory : async (categoryData: { category_name: string }): Promise<CategoryModel> => {
        return await DB.Categories.create(categoryData);
    }
    
    
};

export default repo;
