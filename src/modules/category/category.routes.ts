import express from 'express';
import {
    addCategoryController,
    getCategoriesController,
} from './category.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const categoryRouter = express.Router();

// Route to fetch all categories
categoryRouter.get('/', authMiddleware, getCategoriesController);

// Route to add a new category
categoryRouter.post('/', authMiddleware, addCategoryController);

export default categoryRouter;
