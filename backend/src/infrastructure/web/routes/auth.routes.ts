// backend/src/infrastructure/web/routes/auth.routes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { authRateLimiter, refreshRateLimiter } from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('stripePaymentIntentId').notEmpty()
  ],
  validateRequest,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validateRequest,
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/check', authController.checkAuth);

export { router as authRouter };