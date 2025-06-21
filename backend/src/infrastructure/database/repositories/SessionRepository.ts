import { Repository, MoreThan, Between } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { SessionEntity } from '../entities/Session.entity';
import { ISessionRepository } from '../../../domain/repositories/ISessionRepository';
import { Session } from '../../../domain/entities/Session';

export class SessionRepository implements ISessionRepository {
  private repository: Repository<SessionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(SessionEntity);
  }

  async create(session: Session): Promise<Session> {
    const entity = this.toEntity(session);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Session | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findUpcoming(limit?: number): Promise<Session[]> {
    const entities = await this.repository.find({
      where: { 
        scheduledAt: MoreThan(new Date()),
        isActive: true 
      },
      order: { scheduledAt: 'ASC' },
      take: limit,
    });
    return entities.map(e => this.toDomain(e));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    const entities = await this.repository.find({
      where: { 
        scheduledAt: Between(startDate, endDate),
        isActive: true 
      },
      order: { scheduledAt: 'ASC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async update(session: Session): Promise<Session> {
    const entity = this.toEntity(session);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async incrementParticipants(id: string): Promise<Session | null> {
    await this.repository.increment({ id }, 'currentParticipants', 1);
    return this.findById(id);
  }

  async decrementParticipants(id: string): Promise<Session | null> {
    await this.repository.decrement({ id }, 'currentParticipants', 1);
    return this.findById(id);
  }

  private toDomain(entity: SessionEntity): Session {
    return new Session(
      entity.id,
      entity.title,
      entity.description,
      entity.type,
      entity.hostId,
      entity.meetingUrl ?? undefined,
      entity.scheduledAt,
      entity.duration,
      entity.maxParticipants,
      entity.currentParticipants,
      entity.pointsRequired,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(session: Session): SessionEntity {
    const entity = new SessionEntity();
    entity.id = session.id;
    entity.title = session.title;
    entity.description = session.description;
    entity.type = session.type;
    entity.hostId = session.hostId;
    entity.meetingUrl = session.meetingUrl || null;
    entity.scheduledAt = session.scheduledAt;
    entity.duration = session.duration;
    entity.maxParticipants = session.maxParticipants;
    entity.currentParticipants = session.currentParticipants;
    entity.pointsRequired = session.pointsRequired;
    entity.isActive = session.isActive;
    entity.createdAt = session.createdAt;
    entity.updatedAt = session.updatedAt;
    return entity;
  }
}