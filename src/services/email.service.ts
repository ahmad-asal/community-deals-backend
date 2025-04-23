import { sendEmail } from '../config/email.config';
import { emailTemplates } from '../templates/email.templates';

export class EmailService {
    static async sendWelcomeEmail(email: string, name: string) {
        const subject = 'Welcome to Community Deals!';
        const html = emailTemplates.welcome(name);
        return sendEmail(email, subject, html);
    }

    static async sendDealNotification(email: string, dealTitle: string, userName: string) {
        const subject = 'New Deal Alert!';
        const html = emailTemplates.dealNotification(dealTitle, userName);
        return sendEmail(email, subject, html);
    }

    static async sendPasswordResetEmail(email: string, resetLink: string) {
        const subject = 'Password Reset Request';
        const html = emailTemplates.passwordReset(resetLink);
        return sendEmail(email, subject, html);
    }
} 