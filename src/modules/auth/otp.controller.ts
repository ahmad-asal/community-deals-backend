import { Request, Response } from 'express';
import {
    generateOTP as generateOTPService,
    saveOTP,
    verifyOTP as verifyOTPService,
} from './otp.service';

export const generateOTP = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { email } = req.body;

        // Generate OTP
        const otp = generateOTPService();

        // Save OTP to database
        await saveOTP(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate OTP',
        });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        // Verify OTP
        const isValid = await verifyOTPService(email, otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
        });
    }
};
