import express from 'express';
import { addOneController, DealsController, filterDealsController, getOne } from './deal.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const DealRouter = express.Router();

// Route to fetch all deals
DealRouter.get('/', authMiddleware, DealsController);
DealRouter.post('/', authMiddleware, addOneController);
DealRouter.get('/filter-deals', authMiddleware, filterDealsController);
DealRouter.get('/deal/:id', authMiddleware, getOne);



export default DealRouter;
