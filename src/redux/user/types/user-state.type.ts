import { User } from "@/src/types/user.type";

export type UserStateType = {
  userInfo: User | null,
  pending: {
    userInfo: boolean;
  };
  errors: {
    userInfo: string | null;
  }
}