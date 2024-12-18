import { NextFunction, Request, Response } from 'express';
import { addCategoryService, categoryService } from './category.service';
import { CustomError } from '@/utils/custom-error';

export const getCategoriesController = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const response = await categoryService();

            res.status(200).json({
                message: 'Successfully get categories',
                data: response
            });
        } catch (error) {
            next(error);
        }
    };

// Controller to add a new category
export const addCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { category_name } = req.body;

        // Validate input
        if (!category_name) {
            throw new CustomError('Category name is required', 400);
        }

        const response = await addCategoryService({ category_name });

        res.status(201).json({
            message: 'Category successfully created',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};


