export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ITokenService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
  generateRefreshToken(userId: string): string;
  verifyRefreshToken(refreshToken: string): string | null;
}