import express from 'express';
import { addCategoryController, getCategoriesController } from './category.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const categoryRouter = express.Router();

// Route to fetch all categories
categoryRouter.get('/categories', authMiddleware, getCategoriesController);

// Route to add a new category
categoryRouter.post('/categories', authMiddleware, addCategoryController);

export default categoryRouter;
