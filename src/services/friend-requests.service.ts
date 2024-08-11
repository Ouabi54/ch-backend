import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import friendRequestModel from '@/models/friend-requests.model';
import { FriendRequest, FriendRequestStatus } from '@/interfaces/friend-requests.interface';
import { FriendRequestActionDto, FriendRequestDto } from '@/dtos/friend-requests.dto';
import userModel from '@/models/users.model';
import { app } from '@/server';
import { SocketEventType } from '@/interfaces/socket.interface';

class FriendshipRequestService {
  public friendRequests = friendRequestModel;
  public users = userModel;

  public async getRequests(userData: User): Promise<FriendRequest[]> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const requests: FriendRequest[] = await this.friendRequests
      .find({ $or: [{ sender: userData._id }, { target: userData._id }] })
      .populate('sender', '-password')
      .populate('target', '-password')
      .exec();
    return requests;
  }

  public async getFriends(userData: User): Promise<User[]> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const user: any = await this.users.findOne({ _id: userData._id }).populate('friends', '-password').exec();
    return user.friends;
  }

  // Send a friend request to a user
  public async sendRequest(userData: User, requestData: FriendRequestDto): Promise<void> {
    const io = app.getSocketIo();
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const targetUser = await this.users.findOne({ _id: requestData.targetId });

    // The target doesn't exist
    if (!targetUser) throw new HttpException(400, 'User not found');

    // The user can't send a request to himself
    if (userData._id.toString() == requestData.targetId.toString()) throw new HttpException(400, "Can't send an invite to yourself");

    // The target user is already in the list of friends
    if (userData.friends.includes(requestData.targetId)) throw new HttpException(400, 'User already in the list of friends');

    // The user can't send a new request if there is a similar PENDING request
    const pendingRequest = await this.friendRequests.findOne({
      $and: [{ sender: userData._id }, { target: requestData.targetId }, { status: FriendRequestStatus.PENDING }],
    });
    if (pendingRequest) throw new HttpException(400, 'Similar request is pending');

    await this.friendRequests.create({ sender: userData._id, target: requestData.targetId });
    io.emit(requestData.targetId, { email: userData.email, type: SocketEventType.NEW_FRIEND_REQUEST }); // We emit an event to the target using socket io
  }

  // Cancel a friend request sent to a user
  public async cancelRequest(userData: User, requestData: FriendRequestActionDto): Promise<void> {
    const io = app.getSocketIo();
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const request = await this.friendRequests.findOne({ _id: requestData.requestId });

    // The request doesn't exist
    if (!request) throw new HttpException(400, 'Friend request not found');

    // The user is not the sender
    if (request.sender.toString() != userData._id.toString()) throw new HttpException(400, 'Not authorized to cancel this request');

    // The request is not PENDING
    if (request.status != FriendRequestStatus.PENDING) throw new HttpException(400, 'Can only cancel a pending request');

    request.status = FriendRequestStatus.CANCELED;
    await request.save();
    io.emit(request.target, { email: userData.email, type: SocketEventType.CANCEL_FRIEND_REQUEST }); // We emit an event to the target using socket io

  }

  // Accept a friend request
  public async acceptRequest(userData: User, requestData: FriendRequestActionDto): Promise<void> {
    const io = app.getSocketIo();
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const request = await this.friendRequests.findOne({ _id: requestData.requestId });

    // The request doesn't exist
    if (!request) throw new HttpException(400, 'Friend request not found');

    // The user is not the target
    if (request.target.toString() != userData._id.toString()) throw new HttpException(400, 'Not authorized to accept this request');

    // The request is not PENDING
    if (request.status != FriendRequestStatus.PENDING) throw new HttpException(400, 'Can only accept a pending request');

    request.status = FriendRequestStatus.ACCEPTED;
    await request.save();

    // We add the friend for the target and the sender
    const target = await this.users.findByIdAndUpdate(
      request.target,
      { $addToSet: { friends: request.sender } },
      { new: false, useFindAndModify: false },
    );
    await this.users.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.target } }, { new: false, useFindAndModify: false });
    io.emit(request.sender, { email: target.email, type: SocketEventType.ACCEPT_FRIEND_REQUEST }); // We emit an event to the sender using socket io
  }

  // Reject a friend request
  public async rejectRequest(userData: User, requestData: FriendRequestActionDto): Promise<void> {
    const io = app.getSocketIo();
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const request: any = await this.friendRequests
    .findOne({ _id: requestData.requestId })
    .populate('sender', '-password')
    .populate('target', '-password')
    .exec();

    // The request doesn't exist
    if (!request) throw new HttpException(400, 'Friend request not found');

    // The user is not the target
    if (request.target._id.toString() != userData._id.toString()) throw new HttpException(400, 'Not authorized to reject this request');

    // The request is not PENDING
    if (request.status != FriendRequestStatus.PENDING) throw new HttpException(400, 'Can only reject a pending request');

    request.status = FriendRequestStatus.REJECTED;
    await request.save();
    io.emit(request.sender._id, { email: request.target.email, type: SocketEventType.REJECT_FRIEND_REQUEST }); // We emit an event to the sender using socket io
  }

  // Remove a friend
  public async removeFriend(userData: User, requestData: FriendRequestDto): Promise<void> {
    const io = app.getSocketIo();
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    // If the target user is not in the list of friend
    if (!userData.friends.includes(requestData.targetId)) throw new HttpException(400, 'User not in the list of friends');

    // We remove the friend for the target and the sender
    await this.users.findByIdAndUpdate(requestData.targetId, { $pull: { friends: userData._id } }, { new: false, useFindAndModify: false });
    await this.users.findByIdAndUpdate(userData._id, { $pull: { friends: requestData.targetId } }, { new: false, useFindAndModify: false });
    io.emit(requestData.targetId, { email: userData.email, type: SocketEventType.DELETE_FRIEND }); // We emit an event to the sender using socket io
  }
}

export default FriendshipRequestService;
