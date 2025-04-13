import { Request, Response } from 'express';

// controllers/otpController.js
import { generateOTP, saveOTP, verifyOTP } from './otp.service';

exports.generateOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        // Generate OTP
        const otp = generateOTP();

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

exports.verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        // Verify OTP
        const isValid = await verifyOTP(email, otp);

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
export { generateOTP, verifyOTP };
