import { Op } from 'sequelize';
import { DB } from '@/database';



// Generate a 6-digit OTP
export const generateOTP = () => {
    return '000000';
    //return crypto.randomInt(100000, 999999).toString();
};

// Save OTP to database
export const saveOTP = async (email: string, otp: string) => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

    // Mark any existing OTPs for this email as used
    await DB.Otp.update({ isUsed: true }, { where: { email, isUsed: false } });

    // Save new OTP
    await DB.Otp.create({
        email,
        otp,
        expiresAt: expiresAt.toISOString(), // Convert to string for database storage
        isUsed: false
    });
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string) => {
    const otpRecord = await DB.Otp.findOne({
        where: {
            email,
            otp,
            isUsed: false,
            expiresAt: { [Op.gt]: new Date() },
        },
    });

    if (!otpRecord) {
        return false;
    }

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });
    return true;
};

module.exports = {
    generateOTP,
    saveOTP,
    verifyOTP,
};
