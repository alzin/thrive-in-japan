import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";

// backend/src/application/use-cases/auth/GetActiveSessionsUseCase.ts
export class GetActiveSessionsUseCase {
    constructor(
        private refreshTokenRepository: IRefreshTokenRepository
    ) { }

    async execute(userId: string) {
        const tokens = await this.refreshTokenRepository.findByUserId(userId);

        return tokens.map(token => ({
            id: token.id,
            lastUsedAt: token.lastUsedAt,
            ipAddress: token.ipAddress,
            userAgent: token.userAgent,
            createdAt: token.createdAt,
            expiresAt: token.expiresAt,
            isExpired: token.isExpired()
        }));
    }
}