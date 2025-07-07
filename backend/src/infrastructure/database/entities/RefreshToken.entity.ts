// backend/src/infrastructure/database/entities/RefreshToken.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './User.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    userId!: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Column('text', { unique: true })
    token!: string;

    @Column()
    expiresAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastUsedAt!: Date | null;

    @Column({ type: 'varchar', nullable: true })
    ipAddress!: string | null;

    @Column('text', { nullable: true })
    userAgent!: string | null;
}