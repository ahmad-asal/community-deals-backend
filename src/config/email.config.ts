import sgMail from '@sendgrid/mail';

export const initializeEmailService = () => {
    if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY is not defined in environment variables');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@communitydeals.com',
            subject,
            html,
        };
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}; 