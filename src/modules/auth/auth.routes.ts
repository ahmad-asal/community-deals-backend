import express from 'express';
import {
    signInController,
    signUpController,
    changePasswordController,
} from './auth.controller';
import { generateOTP, verifyOTP } from './otp.controller';

const authRouter = express.Router();

// OTP routes
authRouter.post('/generate-otp', generateOTP);
authRouter.post('/verify-otp', verifyOTP);

authRouter.post('/signup', signUpController);
authRouter.post('/signin', signInController);
authRouter.post('/:id/change-password', changePasswordController);

export default authRouter;
