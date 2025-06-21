import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateBookingUseCase } from '../../../application/use-cases/booking/CreateBookingUseCase';
import { SessionRepository } from '../../database/repositories/SessionRepository';
import { BookingRepository } from '../../database/repositories/BookingRepository';
import { ProfileRepository } from '../../database/repositories/ProfileRepository';

export class BookingController {
  async createBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.body;

      const createBookingUseCase = new CreateBookingUseCase(
        new SessionRepository(),
        new BookingRepository(),
        new ProfileRepository()
      );

      const booking = await createBookingUseCase.execute({
        userId: req.user!.userId,
        sessionId
      });

      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookingRepository = new BookingRepository();
      const bookings = await bookingRepository.findByUserId(req.user!.userId);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookingId } = req.params;
      const bookingRepository = new BookingRepository();
      
      const booking = await bookingRepository.findById(bookingId);
      if (!booking || booking.userId !== req.user!.userId) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      await bookingRepository.cancel(bookingId);
      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      next(error);
    }
  }
}