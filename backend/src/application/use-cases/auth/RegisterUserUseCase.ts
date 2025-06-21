import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IProfileRepository } from '../../../domain/repositories/IProfileRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { Profile } from '../../../domain/entities/Profile';
import { IEmailService } from '../../services/IEmailService';
import { IPasswordService } from '../../services/IPasswordService';
import { IPaymentService } from '../../services/IPaymentService';

export interface RegisterUserDTO {
  email: string;
  stripePaymentIntentId: string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private profileRepository: IProfileRepository,
    private paymentRepository: IPaymentRepository,
    private emailService: IEmailService,
    private passwordService: IPasswordService,
    private paymentService: IPaymentService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<{ user: User; temporaryPassword: string }> {
    // Verify payment
    // const payment = await this.paymentRepository.findByStripePaymentIntentId(dto.stripePaymentIntentId);
    // if (!payment || payment.status !== 'COMPLETED') {
    //   throw new Error('Payment not found or not completed');
    // }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Generate temporary password
    const temporaryPassword = this.passwordService.generateTemporaryPassword();
    const hashedPassword = await this.passwordService.hash(temporaryPassword);

    // Create user
    const user = new User(
      this.generateId(),
      dto.email,
      hashedPassword,
      UserRole.STUDENT,
      true,
      new Date(),
      new Date()
    );

    const savedUser = await this.userRepository.create(user);

    // Create profile
    const profile = new Profile(
      this.generateId(),
      savedUser.id,
      dto.email.split('@')[0], // Default name from email
      '',
      '',
      'N5', // Default language level
      0, // Starting points
      [], // No badges initially
      1, // Starting level
      new Date(),
      new Date()
    );

    await this.profileRepository.create(profile);

    // Send welcome email with password
    await this.emailService.sendWelcomeEmail(dto.email, temporaryPassword);

    return { user: savedUser, temporaryPassword };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}