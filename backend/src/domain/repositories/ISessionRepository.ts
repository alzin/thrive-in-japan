import { Session } from '../entities/Session';

export interface ISessionRepository {
  create(session: Session): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  findUpcoming(limit?: number): Promise<Session[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Session[]>;
  update(session: Session): Promise<Session>;
  delete(id: string): Promise<boolean>;
  incrementParticipants(id: string): Promise<Session | null>;
  decrementParticipants(id: string): Promise<Session | null>;
}