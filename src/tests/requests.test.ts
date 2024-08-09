import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import AuthRoute from '../routes/auth.route';
import UsersRoute from '../routes/users.route';
import IndexRoute from '../routes/index.route';
import FriendRequestsRoute from '../routes/friend-requests.route';
import friendRequestModel from '../models/friend-requests.model';


const userData = {
  email: 'test@email.com',
  password: 'q1w2e3r4!',
};

// Mock getSocketIo to return a mock Socket.IO object
jest.mock('@/server', () => ({
  app: {
    getSocketIo: jest.fn().mockReturnValue({
      emit: jest.fn(),
    }),
  },
}));

const mockRequests = [
  {
    _id: '66b3b006f2cf6744565c51d8',
    sender: {
      _id: '66b3962e809f638cf229c84b',
      email: 'ouabi54@gmail.com',
      updated_at: '2024-08-09T12:22:03.069Z',
    },
    target: {
      _id: '66b397928e5e35604646706e',
      email: 'ouabi547@gmail.com',
      updated_at: '2024-08-09T11:19:26.792Z',
    },
    status: 'CANCELED',
    created_at: '2024-08-07T17:33:58.960Z',
    updated_at: '2024-08-07T18:09:06.387Z',
  },
  {
    _id: '66b3b8bac85d85966b065f2b',
    sender: {
      _id: '66b3962e809f638cf229c84b',
      email: 'ouabi54@gmail.com',
      updated_at: '2024-08-09T12:22:03.069Z',
    },
    target: {
      _id: '66b397928e5e35604646706e',
      email: 'ouabi547@gmail.com',
      updated_at: '2024-08-09T11:19:26.792Z',
    },
    status: 'CANCELED',
    created_at: '2024-08-07T18:11:06.646Z',
    updated_at: '2024-08-07T18:11:23.017Z',
  },
];

describe('Testing Requests', () => {
  let app: App;
  let authRoute: AuthRoute;
  let usersRoute: UsersRoute;
  let friendRequestsRoute: FriendRequestsRoute;
  let indexRoute: IndexRoute;
  let cookies: any;

  beforeAll(async () => {
    jest.setTimeout(10000);

    (mongoose as any).connect = jest.fn().mockResolvedValue(true); // Mock successful connection
    authRoute = new AuthRoute();
    usersRoute = new UsersRoute();
    friendRequestsRoute = new FriendRequestsRoute();

    const users = authRoute.authController.authService.users;
    users.findOne = jest.fn().mockResolvedValue({
      _id: '60706478aad6c9ad19a31c84',
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
    });

    app = new App([friendRequestsRoute, authRoute, usersRoute]);

    const loginResponse = await request(app.getServer())
      .post(`${authRoute.path}/login`)
      .send(userData);

    // Extract cookies from login response
    cookies = loginResponse.headers['set-cookie'] || [];
  });

  afterAll(async () => {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  });

  describe('[GET] /requests', () => {
    it('response findAll Requests', async () => {
      jest.spyOn(friendRequestModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockRequests)
      }  as any);

      const response = await request(app.getServer())
        .get(`${friendRequestsRoute.path}/requests`)
        .set('Cookie', cookies) // Use cookies from login
        .expect(201);
    
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(mockRequests[0]);
    });
  });
});
