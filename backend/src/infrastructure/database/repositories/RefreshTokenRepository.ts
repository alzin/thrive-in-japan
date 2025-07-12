// backend/src/infrastructure/database/repositories/RefreshTokenRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { RefreshTokenEntity } from '../entities/RefreshToken.entity';
import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshTokenRepository';
import { RefreshToken } from '../../../domain/entities/RefreshToken';

export class RefreshTokenRepository implements IRefreshTokenRepository {
    private repository: Repository<RefreshTokenEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(RefreshTokenEntity);
    }

    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
        const entity = this.toEntity(refreshToken);
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }

    async findByToken(token: string): Promise<RefreshToken | null> {
        const entity = await this.repository.findOne({ where: { token } });
        return entity ? this.toDomain(entity) : null;
    }

    async findByUserId(userId: string): Promise<RefreshToken[]> {
        const entities = await this.repository.find({ where: { userId } });
        return entities.map(e => this.toDomain(e));
    }

    async update(refreshToken: RefreshToken): Promise<RefreshToken> {
        const entity = this.toEntity(refreshToken);
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }

    async deleteByToken(token: string): Promise<boolean> {
        const result = await this.repository.delete({ token });
        return result.affected !== 0;
    }

    async deleteByUserId(userId: string): Promise<boolean> {
        const result = await this.repository.delete({ userId });
        return result.affected !== 0;
    }

    async deleteExpired(): Promise<number> {
        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .where('expiresAt < :now', { now: new Date() })
            .execute();
        return result.affected || 0;
    }

    private toDomain(entity: RefreshTokenEntity): RefreshToken {
        return new RefreshToken(
            entity.id,
            entity.userId,
            entity.token,
            entity.expiresAt,
            entity.createdAt,
            entity.lastUsedAt ?? undefined,
            entity.ipAddress ?? undefined,
            entity.userAgent ?? undefined
        );
    }

    private toEntity(domain: RefreshToken): RefreshTokenEntity {
        const entity = new RefreshTokenEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.token = domain.token;
        entity.expiresAt = domain.expiresAt;
        entity.createdAt = domain.createdAt;
        entity.lastUsedAt = domain.lastUsedAt || null;
        entity.ipAddress = domain.ipAddress || null;
        entity.userAgent = domain.userAgent || null;
        return entity;
    }
}