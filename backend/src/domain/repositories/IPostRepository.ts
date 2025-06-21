import { Post } from '../entities/Post';

export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(limit?: number, offset?: number): Promise<{ posts: Post[]; total: number }>;
  findByUserId(userId: string): Promise<Post[]>;
  findAnnouncements(): Promise<Post[]>;
  update(post: Post): Promise<Post>;
  delete(id: string): Promise<boolean>;
  incrementLikes(id: string): Promise<Post | null>;
  decrementLikes(id: string): Promise<Post | null>;
}
