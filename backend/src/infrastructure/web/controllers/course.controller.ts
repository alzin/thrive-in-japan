import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CourseRepository } from '../../database/repositories/CourseRepository';
import { LessonRepository } from '../../database/repositories/LessonRepository';
import { ProgressRepository } from '../../database/repositories/ProgressRepository';
import { CompleteLessonUseCase } from '../../../application/use-cases/lesson/CompleteLessonUseCase';
import { ProfileRepository } from '../../database/repositories/ProfileRepository';

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
      const { reflectionContent } = req.body;

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
}
