import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import FriendshipRequestService from '@/services/friend-requests.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { FriendRequestActionDto, FriendRequestDto } from '@/dtos/friend-requests.dto';
import { FriendRequest } from '@/interfaces/friend-requests.interface';

class FriendRequestsController {
  public friendRequestService = new FriendshipRequestService();

  public getRequests = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const friendRequests: FriendRequest[] = await this.friendRequestService.getRequests(userData);
      res.status(201).json(friendRequests);
    } catch (error) {
      next(error);
    }
  };

  public sendRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const friendRequest: FriendRequestDto = req.body;
      await this.friendRequestService.sendRequest(userData, friendRequest);
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public cancelRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const cancelRequest: FriendRequestActionDto = req.body;
      await this.friendRequestService.cancelRequest(userData, cancelRequest);
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public acceptRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const acceptRequest: FriendRequestActionDto = req.body;
      await this.friendRequestService.acceptRequest(userData, acceptRequest);
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public rejectRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const rejectRequest: FriendRequestActionDto = req.body;
      await this.friendRequestService.rejectRequest(userData, rejectRequest);
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public removeFriend = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const removeFriend: FriendRequestDto = req.body;
      await this.friendRequestService.removeFriend(userData, removeFriend);
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public getFriends = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const friends = await this.friendRequestService.getFriends(userData);
      res.status(201).json(friends);
    } catch (error) {
      next(error);
    }
  };
}

export default FriendRequestsController;
