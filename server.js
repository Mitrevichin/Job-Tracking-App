/* 
 All errors that occur in async functions will be caught and forwarded to your error-handling middleware (just like synchronous errors).
 
 There is a difference between express-async-handler and express-async-errors, and they solve the same problem (handling async errors in Express) in two different ways.Express-async-handler - You wrap each route handler in a function. Express-async-errors - You just require it once (no wrapping needed) and a global error middleware is needed
*/
import 'express-async-errors';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

// Public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// Middlewares
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

// Routers
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

// The order matters. If the request is not one of the CRUD methods above
// it's gonna enter this middleware
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not found!' });
});

// If there is a throw new Error somewhere, it's gonna be caught here in the err
/*This error middleware will automatically catch the error, whether it's synchronous or asynchronous when express-async-errors is installed. No need of try-catch*/
app.use(errorHandlerMiddleware);

connectToDB();
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database connected');

    // mongoose.connection is a reference to that connection object, which you can use to listen for connection events (like 'error', 'open', 'disconnected', etc.).
    const db = mongoose.connection;
    db.on('error', err => console.error('Mongoose connection error', err));
  } catch (err) {
    console.log('Fail to connect to DB:', err);
    process.exit(1);
  }
}

const port = process.env.PORT || 5100;

app.listen(5100, () => console.log(`server is running at port ${port}...`));
