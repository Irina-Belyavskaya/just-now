import { User } from "./user.type";

export type FriendRequest = {
  friend_request_id: string,
  sender_id: string,
  receiver_id: string,
  friend_request_status: FriendRequestStatus,
  friend_request_created_at: string,
}

export type FriendRequestSenders = {
  friend_request_id: string,
  sender: User
}

export enum FriendRequestStatus {
  REQUEST = "REQUEST",
  ACCEPTED = "ACCEPTED",
}