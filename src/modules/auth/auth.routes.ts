import express from 'express';
import {
    signInController,
    signUpController,
    changePasswordController,
} from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', signUpController);
authRouter.post('/signin', signInController);
authRouter.post('/:id/change-password', changePasswordController);

export default authRouter;
