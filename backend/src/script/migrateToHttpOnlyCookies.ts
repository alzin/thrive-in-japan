// backend/src/scripts/migrateToHttpOnlyCookies.ts
import 'reflect-metadata';
import { AppDataSource } from '../infrastructure/database/config/database.config';
import { RefreshTokenRepository } from '../infrastructure/database/repositories/RefreshTokenRepository';
import { UserRepository } from '../infrastructure/database/repositories/UserRepository';

async function migrateToHttpOnlyCookies() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const refreshTokenRepo = new RefreshTokenRepository();

        // Clean up any expired tokens
        const deletedCount = await refreshTokenRepo.deleteExpired();
        console.log(`Deleted ${deletedCount} expired refresh tokens`);

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await AppDataSource.destroy();
    }
}

migrateToHttpOnlyCookies();