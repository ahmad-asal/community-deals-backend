import authRouter from '@/modules/auth/auth.routes';
import categoryRouter from '@/modules/category/category.routes';
import userRouter from '@/modules/user/user.routes';
import dealsRouter from '@/modules/deal/deal.routes';
import FavoriteDealRouter from '@/modules/favorite_deals/favoriteDeals.routes';

import express from 'express';
import commentsRouter from '@/modules/comments/comments.routes';
import citiesRouter from '@/modules/city/city.routes';
import conversationsRouter from '@/modules/conversation/conversation.routes';
import messagesRouter from '@/modules/messages/messages.routes';
import notificationsRouter from '@/modules/notification/notification.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/deals', dealsRouter);
router.use('/favorite-deals', FavoriteDealRouter);
router.use('/comments', commentsRouter);
router.use('/cities', citiesRouter);
router.use('/conversations', conversationsRouter);
router.use('/messages', messagesRouter);
router.use('/notification', notificationsRouter);

export default router;
