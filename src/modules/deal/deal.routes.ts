import express from 'express';
import {
    addOneController,
    getDeals,
    getOne,
    updateStatus,
} from './deal.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/authorizeRole';
import { rolesTypes } from '@/interfaces/user.interfaces';

const DealRouter = express.Router();

// Route to fetch all deals
DealRouter.get('/', authMiddleware, getDeals);
DealRouter.post('/', authMiddleware, addOneController);
DealRouter.get('/deal/:id', authMiddleware, getOne);
DealRouter.put(
    '/:id/updatestatus',
    authMiddleware,
    authorizeRole([rolesTypes.admin]),
    updateStatus,
);
DealRouter.post('/deal/:id/updateIntrest', authMiddleware, getOne);

export default DealRouter;
