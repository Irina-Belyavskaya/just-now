import { User } from "./user.type";

export type Post = {
  post_id: string;
  user_id: string;
  post_content_url: string;
  post_created_at: string;
  likes: number;
  user: User;
}