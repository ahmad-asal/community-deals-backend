import express from 'express';
import {
    addOneController,
    DealsController,
    filterDealsController,
    getOne,
    updateStatus,
} from './deal.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/authorizeRole';
import { rolesTypes } from '@/interfaces/user.interfaces';

const DealRouter = express.Router();

// Route to fetch all deals
DealRouter.get('/', authMiddleware, DealsController);
DealRouter.post('/', authMiddleware, addOneController);
DealRouter.get('/filter-deals', authMiddleware, filterDealsController);
DealRouter.get('/deal/:id', authMiddleware, getOne);
DealRouter.put(
    '/:id/updatestatus',
    authMiddleware,
    authorizeRole([rolesTypes.admin]),
    updateStatus,
);
DealRouter.post('/deal/:id/updateIntrest', authMiddleware, getOne);

export default DealRouter;
