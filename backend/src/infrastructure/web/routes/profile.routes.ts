import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const profileController = new ProfileController();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.use(authenticate);

router.get('/me', profileController.getMyProfile);
router.put(
  '/me',
  [
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('bio').optional().trim().isLength({ max: 500 }),
    body('languageLevel').optional().isIn(['N5', 'N4', 'N3', 'N2', 'N1'])
  ],
  validateRequest,
  profileController.updateProfile
);
router.post('/me/photo', upload.single('photo'), profileController.uploadProfilePhoto);

export { router as profileRouter };