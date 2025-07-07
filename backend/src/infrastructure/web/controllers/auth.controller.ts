// backend/src/infrastructure/web/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/RefreshTokenUseCase';
import { UserRepository } from '../../database/repositories/UserRepository';
import { ProfileRepository } from '../../database/repositories/ProfileRepository';
import { PaymentRepository } from '../../database/repositories/PaymentRepository';
import { RefreshTokenRepository } from '../../database/repositories/RefreshTokenRepository';
import { EmailService } from '../../services/EmailService';
import { PasswordService } from '../../services/PasswordService';
import { TokenService } from '../../services/TokenService';
import { PaymentService } from '../../services/PaymentService';
import { AuthenticationError } from '../../../domain/errors/AuthenticationError';
import { getAccessTokenCookieConfig, getRefreshTokenCookieConfig, COOKIE_NAMES } from '../../config/cookieConfig';

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
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const loginUseCase = new LoginUseCase(
        new UserRepository(),
        new RefreshTokenRepository(),
        new PasswordService(),
        new TokenService()
      );

      const { response, tokens } = await loginUseCase.execute({
        email,
        password,
        ipAddress,
        userAgent
      });

      // Set cookies
      const accessTokenConfig = getAccessTokenCookieConfig();
      const refreshTokenConfig = getRefreshTokenCookieConfig();

      res.cookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
        ...accessTokenConfig,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
        ...refreshTokenConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json(response);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

      if (!refreshToken) {
        res.status(403).json({ error: 'Refresh token not provided' });
        return;
      }

      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const refreshTokenUseCase = new RefreshTokenUseCase(
        new UserRepository(),
        new RefreshTokenRepository(),
        new TokenService()
      );

      const { response, tokens } = await refreshTokenUseCase.execute({
        refreshToken,
        ipAddress,
        userAgent
      });

      // Set new cookies
      const accessTokenConfig = getAccessTokenCookieConfig();
      const refreshTokenConfig = getRefreshTokenCookieConfig();

      res.cookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
        ...accessTokenConfig,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
        ...refreshTokenConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json(response);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Clear cookies
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);

    // If we have a refresh token, invalidate it in the database
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
    if (refreshToken) {
      try {
        const refreshTokenRepository = new RefreshTokenRepository();
        await refreshTokenRepository.deleteByToken(refreshToken);
      } catch (error) {
        // Log error but don't fail the logout
        console.error('Failed to invalidate refresh token:', error);
      }
    }

    res.json({ message: 'Logout successful' });
  }

  async checkAuth(req: Request, res: Response): Promise<void> {
    // This endpoint can be used to check if user is authenticated
    const accessToken = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

    if (!refreshToken) {
      res.status(403).json({ authenticated: false });
      return;
    }

    if (!accessToken) {
      res.status(401).json({ authenticated: false });
      return;
    }

    const tokenService = new TokenService();
    const payload = tokenService.verifyAccessToken(accessToken);

    if (!payload) {
      res.status(401).json({ authenticated: false });
      return;
    }

    res.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role
      }
    });
  }
}