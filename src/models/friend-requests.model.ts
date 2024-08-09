import { model, Schema, Document, Types } from 'mongoose';
import { FriendRequest, FriendRequestStatus } from '@/interfaces/friend-requests.interface';

const friendRequestSchema: Schema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    target: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(FriendRequestStatus),
      default: FriendRequestStatus.PENDING,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const friendRequestModel = model<FriendRequest & Document>('Request', friendRequestSchema);

export default friendRequestModel;
