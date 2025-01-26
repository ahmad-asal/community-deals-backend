import { NextFunction, Request, Response } from 'express';
import { signInService, signUpService } from './auth.service';
import { repo as userRepo } from '../user/user.repo';
import bcrypt from 'bcrypt';

export const signUpController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userData = req.body;
        await signUpService(userData);

        res.status(200).json({
            message: 'Successfully signed up',
        });
    } catch (error) {
        next(error);
    }
};

export const signInController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userData = req.body;
        const response = await signInService(userData);

        res.status(200).json({
            message: 'Successfully signed in',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const changePasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: 'Old and new passwords are required' });
        }

        const user = await userRepo.getOne(parseInt(id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};
