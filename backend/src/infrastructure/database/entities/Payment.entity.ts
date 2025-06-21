import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './User.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ unique: true })
  stripePaymentIntentId!: string;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'COMPLETED', 'FAILED']
  })
  status!: 'PENDING' | 'COMPLETED' | 'FAILED';

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any> | undefined;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}