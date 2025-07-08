// backend/src/infrastructure/web/routes/auth.routes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const authController = new AuthController();

// New endpoints for the updated flow
router.post(
  '/send-verification-code',
  [
    body('email').isEmail(),
  ],
  validateRequest,
  authController.sendVerificationCode
);

router.post(
  '/verify-email',
  [
    body('email').isEmail(),
    body('code').isLength({ min: 6, max: 6 }),
  ],
  validateRequest,
  authController.verifyEmail
);

router.post(
  '/complete-registration',
  [
    body('email').isEmail(),
    body('name').notEmpty().trim(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    body('stripePaymentIntentId').notEmpty(),
  ],
  validateRequest,
  authController.completeRegistration
);


router.post(
  '/register',
  [
    body('email').isEmail(),
    body('stripePaymentIntentId').notEmpty()
  ],
  validateRequest,
  authController.register
);

// Existing endpoints
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  validateRequest,
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/check', authController.checkAuth);

export { router as authRouter };