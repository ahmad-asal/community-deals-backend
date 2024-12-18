import authRouter from '@/modules/auth/auth.routes';
import userRouter from '@/modules/user/user.routes';
import express from 'express';

const router = express.Router();
console.log('inside router');
router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
