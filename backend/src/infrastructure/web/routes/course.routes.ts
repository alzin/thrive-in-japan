import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const courseController = new CourseController();

router.use(authenticate);

router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseById);
router.get('/:courseId/lessons', courseController.getCourseLessons);
router.post('/lessons/:lessonId/complete', courseController.completeLesson);

export { router as courseRouter };
