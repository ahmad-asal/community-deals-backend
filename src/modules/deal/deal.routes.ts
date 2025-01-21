import express from 'express';
import {
    addOneController,
    getDeals,
    getDeal,
    updateStatus,
    updateDeal,
} from './deal.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/authorizeRole';
import { rolesTypes } from '@/interfaces/user.interfaces';

const DealRouter = express.Router();

// Route to fetch all deals
DealRouter.post('/', authMiddleware, addOneController);

DealRouter.put(
    '/:id/updatestatus',
    authMiddleware,
    authorizeRole([rolesTypes.admin]),
    updateStatus,
);
DealRouter.put(
    '/:id',
    authMiddleware,
    authorizeRole([rolesTypes.user]),
    updateDeal,
);

DealRouter.get('/:id', authMiddleware, getDeal);
DealRouter.get('/', authMiddleware, getDeals);

export default DealRouter;
