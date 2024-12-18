import repo from './category.repo';
import { CustomError } from '@/utils/custom-error';

export const getAllCategories = async () => {
    try {
        const categories = await repo.getAll();

        if (!categories) {
            throw new CustomError('No categories found', 404);
        }

        console.log('Categories:', categories);
        return categories;
    } catch (error) {
        console.error('Error in category:', error);
        throw new CustomError('Failed to fetch categories', 500);
    }
};

// Add a new category
export const addCategory = async (categoryData: { category_name: string }) => {
    try {
        // Ensure category_name is provided
        if (!categoryData || !categoryData.category_name) {
            throw new CustomError('Category name is required', 400);
        }

        // Check if the category already exists
        const existingCategory = await repo.findByName(categoryData.category_name);
        if (existingCategory) {
            throw new CustomError('Category already exists', 409);
        }

        // Add the category
        const newCategory = await repo.addOne(categoryData);

        console.log('New Category Added:', newCategory);
        return newCategory;
    } catch (error) {
        console.error('Error adding category:', error);
        throw new CustomError('Failed to add category', 500);
    }
};
