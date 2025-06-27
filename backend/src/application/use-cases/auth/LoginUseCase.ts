import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordService } from '../../services/IPasswordService';
import { ITokenService } from '../../services/ITokenService';
import { AuthenticationError } from '../../../domain/errors/AuthenticationError';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is inactive', 403);
    }

    const token = this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}