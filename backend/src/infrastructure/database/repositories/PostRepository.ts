import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { PostEntity } from '../entities/Post.entity';
import { IPostRepository } from '../../../domain/repositories/IPostRepository';
import { Post } from '../../../domain/entities/Post';

export class PostRepository implements IPostRepository {
  private repository: Repository<PostEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(PostEntity);
  }

  async create(post: Post): Promise<Post> {
    const entity = this.toEntity(post);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Post | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(limit?: number, offset?: number): Promise<{ posts: Post[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    
    return {
      posts: entities.map(e => this.toDomain(e)),
      total,
    };
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async findAnnouncements(): Promise<Post[]> {
    const entities = await this.repository.find({
      where: { isAnnouncement: true },
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async update(post: Post): Promise<Post> {
    const entity = this.toEntity(post);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async incrementLikes(id: string): Promise<Post | null> {
    await this.repository.increment({ id }, 'likesCount', 1);
    return this.findById(id);
  }

  async decrementLikes(id: string): Promise<Post | null> {
    await this.repository.decrement({ id }, 'likesCount', 1);
    return this.findById(id);
  }

  private toDomain(entity: PostEntity): Post {
    return new Post(
      entity.id,
      entity.userId,
      entity.content,
      entity.mediaUrls.split(',').filter(url => url),
      entity.isAnnouncement,
      entity.likesCount,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(post: Post): PostEntity {
    const entity = new PostEntity();
    entity.id = post.id;
    entity.userId = post.userId;
    entity.content = post.content;
    entity.mediaUrls = post.mediaUrls.join(',');
    entity.isAnnouncement = post.isAnnouncement;
    entity.likesCount = post.likesCount;
    entity.createdAt = post.createdAt;
    entity.updatedAt = post.updatedAt;
    return entity;
  }
}