import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/services/ITokenService';

export class TokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;
  private readonly refreshSecret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret';
    this.expiresIn = '7d';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.refreshSecret, { expiresIn: '30d' });
  }

  verifyRefreshToken(refreshToken: string): string | null {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshSecret) as { userId: string };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}