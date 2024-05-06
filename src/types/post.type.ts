import { User } from "./user.type";
import { File } from "./file.type";

export type Post = {
  post_id: string;
  user_id: string;
  post_content_id: string;
  post_type: PostType;
  post_created_at: string;
  likes: number;
  user: User;
  file: File;
}

export enum PostType {
  VIDEO = 'VIDEO',
  PHOTO = 'PHOTO'
}