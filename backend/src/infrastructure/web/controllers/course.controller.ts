import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CourseRepository } from '../../database/repositories/CourseRepository';
import { LessonRepository } from '../../database/repositories/LessonRepository';
import { ProgressRepository } from '../../database/repositories/ProgressRepository';
import { CompleteLessonUseCase } from '../../../application/use-cases/lesson/CompleteLessonUseCase';
import { ProfileRepository } from '../../database/repositories/ProfileRepository';
import { EnrollInCourseUseCase } from '../../../application/use-cases/course/EnrollInCourseUseCase';
import { EnrollmentRepository } from '../../database/repositories/EnrollmentRepository';
import { UserRepository } from '../../database/repositories/UserRepository';


export class CourseController {
  async getAllCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseRepository = new CourseRepository();
      const courses = await courseRepository.findAll(true);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const courseRepository = new CourseRepository();
      const course = await courseRepository.findById(courseId);
      
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      res.json(course);
    } catch (error) {
      next(error);
    }
  }

  async getCourseLessons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const lessonRepository = new LessonRepository();
      const progressRepository = new ProgressRepository();
      
      const lessons = await lessonRepository.findByCourseId(courseId);
      const progress = await progressRepository.findByUserAndCourse(req.user!.userId, courseId);
      
      const lessonsWithProgress = lessons.map(lesson => {
        const lessonProgress = progress.find(p => p.lessonId === lesson.id);
        return {
          ...lesson,
          isCompleted: lessonProgress?.isCompleted || false,
          completedAt: lessonProgress?.completedAt
        };
      });

      res.json(lessonsWithProgress);
    } catch (error) {
      next(error);
    }
  }

  async completeLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lessonId } = req.params;

      // Safely handle undefined req.body
      let reflectionContent = undefined;
      if (req.body && typeof req.body === 'object') {
        reflectionContent = req.body.reflectionContent;
      }

      const completeLessonUseCase = new CompleteLessonUseCase(
        new LessonRepository(),
        new ProgressRepository(),
        new ProfileRepository()
      );

      const progress = await completeLessonUseCase.execute({
        userId: req.user!.userId,
        lessonId,
        reflectionContent
      });

      res.json({ message: 'Lesson completed successfully', progress });
    } catch (error) {
      next(error);
    }
  }

  async enrollInCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      
      const enrollmentRepository = new EnrollmentRepository();
      const enrollInCourseUseCase = new EnrollInCourseUseCase(
        new CourseRepository(),
        enrollmentRepository,
        new UserRepository()
      );

      const enrollment = await enrollInCourseUseCase.execute({
        userId: req.user!.userId,
        courseId
      });

      res.status(201).json({ 
        message: 'Successfully enrolled in course',
        enrollment 
      });
    } catch (error: any) {
      if (error.message.includes('Already enrolled')) {
        res.status(409).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async getMyEnrollments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const enrollmentRepository = new EnrollmentRepository();
      const enrollments = await enrollmentRepository.findByUserId(req.user!.userId);
      
      // Get course details for each enrollment
      const courseRepository = new CourseRepository();
      const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await courseRepository.findById(enrollment.courseId);
          return { ...enrollment, course };
        })
      );

      res.json(enrollmentsWithCourses);
    } catch (error) {
      next(error);
    }
  }

  async checkEnrollment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const enrollmentRepository = new EnrollmentRepository();
      
      const enrollment = await enrollmentRepository.findByUserAndCourse(
        req.user!.userId,
        courseId
      );

      res.json({ isEnrolled: !!enrollment });
    } catch (error) {
      next(error);
    }
  }
}
