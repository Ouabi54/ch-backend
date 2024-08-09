import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { FriendRequestActionDto, FriendRequestDto } from '@/dtos/friend-requests.dto';
import FriendRequestsController from '@/controllers/friend-requests.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class FriendRequestsRoute implements Routes {
  public path = '/friends';
  public router = Router();
  public friendRequestsController = new FriendRequestsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/requests/send`,
      authMiddleware,
      validationMiddleware(FriendRequestDto, 'body'),
      this.friendRequestsController.sendRequest,
    );

    this.router.post(
      `${this.path}/requests/cancel`,
      authMiddleware,
      validationMiddleware(FriendRequestActionDto, 'body'),
      this.friendRequestsController.cancelRequest,
    );

    this.router.post(
      `${this.path}/requests/accept`,
      authMiddleware,
      validationMiddleware(FriendRequestActionDto, 'body'),
      this.friendRequestsController.acceptRequest,
    );

    this.router.post(
      `${this.path}/requests/reject`,
      authMiddleware,
      validationMiddleware(FriendRequestActionDto, 'body'),
      this.friendRequestsController.rejectRequest,
    );

    this.router.post(
      `${this.path}/remove`,
      authMiddleware,
      validationMiddleware(FriendRequestDto, 'body'),
      this.friendRequestsController.removeFriend,
    );

    this.router.get(`${this.path}/requests`, authMiddleware, this.friendRequestsController.getRequests);

    this.router.get(`${this.path}/`, authMiddleware, this.friendRequestsController.getFriends);
  }
}

export default FriendRequestsRoute;
