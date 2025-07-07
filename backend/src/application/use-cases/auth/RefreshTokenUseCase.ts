// backend/src/application/use-cases/auth/RefreshTokenUseCase.ts
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshTokenRepository';
import { ITokenService } from '../../services/ITokenService';
import { AuthenticationError } from '../../../domain/errors/AuthenticationError';
import { RefreshToken } from '../../../domain/entities/RefreshToken';

export interface RefreshTokenDTO {
    refreshToken: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface RefreshTokenResponse {
    user: {
        id: string;
        email: string;
        role: string;
    };
    csrfToken: string;
}

export class RefreshTokenUseCase {
    constructor(
        private userRepository: IUserRepository,
        private refreshTokenRepository: IRefreshTokenRepository,
        private tokenService: ITokenService
    ) { }

    async execute(dto: RefreshTokenDTO): Promise<{ response: RefreshTokenResponse; tokens: { accessToken: string; refreshToken: string } }> {
        // Verify refresh token
        const userId = this.tokenService.verifyRefreshToken(dto.refreshToken);
        if (!userId) {
            throw new AuthenticationError('Invalid refresh token');
        }

        // Find stored refresh token
        const storedToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);
        if (!storedToken || storedToken.userId !== userId) {
            throw new AuthenticationError('Invalid refresh token');
        }

        // Check if token is expired
        if (storedToken.isExpired()) {
            await this.refreshTokenRepository.delete(storedToken.id);
            throw new AuthenticationError('Refresh token expired');
        }

        // Get user
        const user = await this.userRepository.findById(userId);
        if (!user || !user.isActive) {
            throw new AuthenticationError('User not found or inactive');
        }

        // Rotate refresh token (delete old, create new)
        await this.refreshTokenRepository.delete(storedToken.id);

        const tokenPair = this.tokenService.generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Store new refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const newRefreshToken = new RefreshToken(
            `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            user.id,
            tokenPair.refreshToken,
            expiresAt,
            new Date(),
            new Date(),
            dto.ipAddress,
            dto.userAgent
        );

        await this.refreshTokenRepository.create(newRefreshToken);

        const csrfToken = this.tokenService.generateCSRFToken();

        return {
            response: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                csrfToken
            },
            tokens: tokenPair
        };
    }
}