import nodemailer from 'nodemailer';
import { IEmailService } from '../../application/services/IEmailService';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(email: string, temporaryPassword: string): Promise<void> {
    const mailOptions = {
      from: `"Thrive in Japan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Thrive in Japan - Your Account Details',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B6B;">Welcome to Thrive in Japan! 🌸</h1>
          <p>Your learning journey begins now!</p>
          <p>Here are your login credentials:</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> <code style="background-color: #fff; padding: 5px;">${temporaryPassword}</code></p>
          </div>
          <p style="color: #666; margin-top: 20px;">Please change your password after your first login.</p>
          <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Login Now</a>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Thrive in Japan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B6B;">Password Reset Request</h1>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Password</a>
          <p style="color: #666; margin-top: 20px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendBookingConfirmation(email: string, sessionDetails: any): Promise<void> {
    const mailOptions = {
      from: `"Thrive in Japan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Booking Confirmation - ' + sessionDetails.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B6B;">Booking Confirmed! 🎉</h1>
          <p>Your session has been booked successfully.</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px;">
            <h3>${sessionDetails.title}</h3>
            <p><strong>Date:</strong> ${new Date(sessionDetails.scheduledAt).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(sessionDetails.scheduledAt).toLocaleTimeString()}</p>
            <p><strong>Duration:</strong> ${sessionDetails.duration} minutes</p>
            ${sessionDetails.meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${sessionDetails.meetingUrl}">${sessionDetails.meetingUrl}</a></p>` : ''}
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendSessionReminder(email: string, sessionDetails: any): Promise<void> {
    const mailOptions = {
      from: `"Thrive in Japan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reminder: Session Starting Soon - ' + sessionDetails.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B6B;">Session Reminder ⏰</h1>
          <p>Your session is starting in 1 hour!</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px;">
            <h3>${sessionDetails.title}</h3>
            <p><strong>Time:</strong> ${new Date(sessionDetails.scheduledAt).toLocaleTimeString()}</p>
            ${sessionDetails.meetingUrl ? `<a href="${sessionDetails.meetingUrl}" style="display: inline-block; background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Join Session</a>` : ''}
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}