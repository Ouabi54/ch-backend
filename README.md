
# Small Friend Management App Backend v0.1

## Introduction

This is the backend for a small friend management application.

## Features

- **TypeScript:** Strongly-typed language for better development experience.
- **Express.js:** Web framework for building APIs.
- **Mongoose:** ODM for MongoDB integration.
- **Socket.IO:** Real-time communication and notifications.
- **User Authentication:** Basic JWT-based authentication with HTTP-only cookies.
- **API Documentation:** Interactive API docs using Swagger and Swagger UI.
- **Error Handling:** Centralized error handling and consistent responses.
- **Environment Configuration:** Secure configuration with environment variables and dotenv.
- **Linting and Formatting:** Consistent code quality with ESLint and Prettier.
- **Testing with Jest:** Unit tests using the Jest framework.
- **Docker Integration:** Containerization for consistent deployment.
- **Nginx Reverse Proxy:** Enhanced performance, security, and load balancing.
- **Process Management:** PM2 or Nodemon for process management and automatic restarts.
- **SWC Compiler:** Faster TypeScript compilation for improved performance.

## Configuration

Before starting, make sure to set up your database credentials in the `.env.development.local` file. This file is for local development and should not be committed to version control.

### Database Configuration

- **DB_CONNECTION_STRING:** `mongodb://127.0.0.1:27017/dev`

## ⚒ How to Install

Install the dependencies:

```bash
yarn install
```

Start the development server:

```bash
yarn dev
```

## ⚒ Lint

Run linting:

```bash
yarn lint
```

## ⚒ Test

Run tests:

```bash
yarn test
```

For other commands, please check the `package.json` file.