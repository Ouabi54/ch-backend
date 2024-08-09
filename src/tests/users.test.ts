import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import AuthRoute from './../routes/auth.route'; // Import AuthRoute for login
import UsersRoute from './../routes/users.route';

describe('Testing Users', () => {
  let cookies: any;
  const userData = {
    email: 'test@email.com',
    password: 'q1w2e3r4!',
  };
  let authRoute: AuthRoute;
  let usersRoute: UsersRoute;
  let app: App;

  (mongoose as any).connect = jest.fn().mockResolvedValue(true); // Mock successful connection

  beforeAll(async () => {
    jest.setTimeout(10000);

    authRoute = new AuthRoute();
    usersRoute = new UsersRoute();

    // Mock user lookup and password hashing
    const users = authRoute.authController.authService.users;
    users.findOne = jest.fn().mockResolvedValue({
      _id: '60706478aad6c9ad19a31c84',
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
    });

    app = new App([authRoute, usersRoute]);

    // Perform login to set cookies
    const loginResponse = await request(app.getServer()).post(`${authRoute.path}/login`).send(userData);

    // Extract cookies from login response
    cookies = loginResponse.headers['set-cookie'] || [];
  });

  afterAll(async () => {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    // Cleanup if needed, e.g., disconnect from the mock database
  });

  describe('[GET] /users', () => {
    it('response findAll Users', async () => {
      // Mock users route
      const users = usersRoute.usersController.userService.users;
      // Mock user data for users route
      users.find = jest.fn().mockResolvedValue([
        {
          _id: 'qpwoeiruty',
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          _id: 'alskdjfhg',
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          _id: 'zmxncbv',
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      // Make a request to the /users endpoint with the cookies from login
      const response = await request(app.getServer())
        .get(`${usersRoute.path}`)
        .set('Cookie', cookies) // Use cookies from login
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toMatchObject({
        _id: 'qpwoeiruty',
        email: 'a@email.com',
      });
    });
  });
});
