export interface FriendRequest {
  _id: string;
  sender: string;
  target: string;
  status: FriendRequestStatus;
}

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
