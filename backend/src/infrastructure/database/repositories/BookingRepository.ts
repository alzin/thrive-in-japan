import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { BookingEntity } from '../entities/Booking.entity';
import { IBookingRepository, Booking } from '../../../domain/repositories/IBookingRepository';

export class BookingRepository implements IBookingRepository {
  private repository: Repository<BookingEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(BookingEntity);
  }

  async create(booking: Booking): Promise<Booking> {
    const entity = this.toEntity(booking);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Booking | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async findBySessionId(sessionId: string): Promise<Booking[]> {
    const entities = await this.repository.find({
      where: { sessionId },
    });
    return entities.map(e => this.toDomain(e));
  }

  async findActiveByUserId(userId: string): Promise<Booking[]> {
    const entities = await this.repository.find({
      where: { userId, status: 'CONFIRMED' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async update(booking: Booking): Promise<Booking> {
    const entity = this.toEntity(booking);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async cancel(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { status: 'CANCELLED' });
    return result.affected !== 0;
  }

  private toDomain(entity: BookingEntity): Booking {
    return {
      id: entity.id,
      userId: entity.userId,
      sessionId: entity.sessionId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toEntity(booking: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = booking.id;
    entity.userId = booking.userId;
    entity.sessionId = booking.sessionId;
    entity.status = booking.status;
    entity.createdAt = booking.createdAt;
    entity.updatedAt = booking.updatedAt;
    return entity;
  }
}