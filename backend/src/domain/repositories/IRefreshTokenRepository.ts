// backend/src/domain/repositories/IRefreshTokenRepository.ts
import { RefreshToken } from '../entities/RefreshToken';

export interface IRefreshTokenRepository {
    create(refreshToken: RefreshToken): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    findByUserId(userId: string): Promise<RefreshToken[]>;
    update(refreshToken: RefreshToken): Promise<RefreshToken>;
    delete(id: string): Promise<boolean>;
    deleteByToken(token: string): Promise<boolean>;
    deleteByUserId(userId: string): Promise<boolean>;
    deleteExpired(): Promise<number>;
}