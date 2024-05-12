import { File } from "./file.type";
import { Role } from "./role.type";

export type User = {
  user_id: string;
  user_email: string;
  user_password: string;
  user_nickname: string;
  user_profile_picture_id: string;
  user_entry_date: string;
  user_created_at: string;
  file: File;
  role: Role;
}