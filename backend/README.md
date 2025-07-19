# SergioIND Backend

A Node.js backend API built with Express.js and MongoDB.

## Features

- Express.js server
- MongoDB database connection
- CORS enabled
- Environment variable configuration
- Error handling middleware
- Basic API structure

## Project Structure

```
backend/
├── controllers/     # Route controllers
├── models/         # MongoDB models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── config/         # Configuration files
├── utils/          # Utility functions
├── server.js       # Main server file
├── package.json    # Dependencies
├── .env           # Environment variables
└── README.md      # This file
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` file:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

- `GET /` - Welcome message

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests (not configured yet)

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **helmet** - Security headers
- **morgan** - HTTP request logger

## Development Dependencies

- **nodemon** - Auto-restart server during development 