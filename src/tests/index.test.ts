import request from 'supertest';
import App from '../app';
import IndexRoute from './../routes/index.route';
import mongoose from 'mongoose'; // Import mongoose to apply the mock

jest.mock('mongoose'); // Mock mongoose

jest.setTimeout(10000);

describe('Testing Index', () => {
  let app: App;

  beforeAll(async () => {
    mongoose.connect = jest.fn().mockResolvedValue(true); // Mock the connection
    app = new App([new IndexRoute()]);
  });

  afterAll(async () => {
    // Ensure database connection is closed
    await app.closeDatabaseConnection();
    mongoose.disconnect = jest.fn().mockResolvedValue(true); // Mock disconnection
  });

  describe('[GET] /', () => {
    it('response statusCode 200', async () => {
      const response = await request(app.getServer()).get('/');
      expect(response.status).toBe(200);
    });
  });
});
