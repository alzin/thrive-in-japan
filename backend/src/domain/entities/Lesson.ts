// backend/src/domain/entities/Lesson.ts
export enum LessonType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  KEYWORDS = 'KEYWORDS'
}

export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessonType: LessonType; 
  contentUrl?: string; 
  audioFiles: string[];
  resources: string[];
  requiresReflection: boolean;
  pointsReward: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Lesson implements ILesson {
  constructor(
    public id: string,
    public courseId: string,
    public title: string,
    public description: string,
    public order: number,
    public lessonType: LessonType,
    public contentUrl: string | undefined,
    public audioFiles: string[],
    public resources: string[],
    public requiresReflection: boolean,
    public pointsReward: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  isFirstLesson(): boolean {
    return this.order === 1;
  }
}