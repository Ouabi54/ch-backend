import { DB_CONNECTION_STRING } from '@config';

export const dbConnection = {
  url: DB_CONNECTION_STRING,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};