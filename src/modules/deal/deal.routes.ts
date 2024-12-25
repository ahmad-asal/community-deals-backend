import express from 'express';
import { DealsController } from './deal.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const DealRouter = express.Router();

// Route to fetch all deals
DealRouter.get('/', authMiddleware, DealsController);

export default DealRouter;
