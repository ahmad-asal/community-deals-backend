import authRouter from '@/modules/auth/auth.routes';
import categoryRouter from '@/modules/category/category.routes';
import userRouter from '@/modules/user/user.routes';
import dealsRouter from '@/modules/deal/deal.routes';

import express from 'express';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/deals', dealsRouter);

export default router;
