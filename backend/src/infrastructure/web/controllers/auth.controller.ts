import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { UserRepository } from '../../database/repositories/UserRepository';
import { ProfileRepository } from '../../database/repositories/ProfileRepository';
import { PaymentRepository } from '../../database/repositories/PaymentRepository';
import { EmailService } from '../../services/EmailService';
import { PasswordService } from '../../services/PasswordService';
import { TokenService } from '../../services/TokenService';
import { PaymentService } from '../../services/PaymentService';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, stripePaymentIntentId } = req.body;

      const registerUseCase = new RegisterUserUseCase(
        new UserRepository(),
        new ProfileRepository(),
        new PaymentRepository(),
        new EmailService(),
        new PasswordService(),
        new PaymentService()
      );

      const result = await registerUseCase.execute({ email, stripePaymentIntentId });

      res.status(201).json({
        message: 'Registration successful. Check your email for login credentials.',
        userId: result.user.id
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const loginUseCase = new LoginUseCase(
        new UserRepository(),
        new PasswordService(),
        new TokenService()
      );

      const result = await loginUseCase.execute({ email, password });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Token-based auth doesn't require server-side logout
    res.json({ message: 'Logout successful' });
  }
}