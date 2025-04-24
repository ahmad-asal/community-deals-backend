export const emailTemplates = {
    welcome: (name: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Community Deals!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for joining our community. We're excited to have you on board!</p>
            <p>You can now start exploring and sharing great deals with other members.</p>
            <p>Best regards,<br>The Community Deals Team</p>
        </div>
    `,
    
    dealNotification: (dealTitle: string, userName: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Deal Alert!</h2>
            <p>Hello ${userName},</p>
            <p>A new deal has been posted: <strong>${dealTitle}</strong></p>
            <p>Check it out and share your thoughts with the community!</p>
            <p>Best regards,<br>The Community Deals Team</p>
        </div>
    `,
    
    passwordReset: (resetLink: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the link below to proceed:</p>
            <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The Community Deals Team</p>
        </div>
    `
}; 