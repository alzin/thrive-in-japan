import { IPostRepository } from '../../../domain/repositories/IPostRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Post } from '../../../domain/entities/Post';
import { UserRole } from '../../../domain/entities/User';

export interface CreatePostDTO {
  userId: string;
  content: string;
  mediaUrls?: string[];
  isAnnouncement?: boolean;
}

export class CreatePostUseCase {
  constructor(
    private postRepository: IPostRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: CreatePostDTO): Promise<Post> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Only admins can create announcements
    if (dto.isAnnouncement && user.role !== UserRole.ADMIN) {
      throw new Error('Only admins can create announcements');
    }

    const post = new Post(
      this.generateId(),
      dto.userId,
      dto.content,
      dto.mediaUrls || [],
      dto.isAnnouncement || false,
      0,
      new Date(),
      new Date()
    );

    return await this.postRepository.create(post);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}