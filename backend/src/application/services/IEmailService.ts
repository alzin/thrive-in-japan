export interface IEmailService {
  sendWelcomeEmail(email: string, temporaryPassword: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
  sendBookingConfirmation(email: string, sessionDetails: any): Promise<void>;
  sendSessionReminder(email: string, sessionDetails: any): Promise<void>;
}