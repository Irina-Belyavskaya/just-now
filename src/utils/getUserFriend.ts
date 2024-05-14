import { FriendRequest } from "../types/friend-requests.type";
import { User } from "../types/user.type";

export const getUserFriend = (userFriendsRequests: FriendRequest, user_id: string): User => {
  if (userFriendsRequests.sender.user_id !== user_id) {
    return userFriendsRequests.sender;
  }
  return userFriendsRequests.receiver;
}