/* All errors that occur in async functions will be caught and forwarded to your error-handling middleware (just like synchronous errors) */
import 'express-async-errors';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import errorHandlerMiddleware from './controllers/middleware/errorHandlerMiddleware.js';

import jobRouter from './routes/jobRouter.js';

dotenv.config();
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.post('/', (req, res) => {
  console.log(req);
  res.json({ message: 'Data received', data: req.body });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/jobs', jobRouter);

// The order matters. If the request is not one of the CRUD methods above
// it's gonna enter this middleware
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not found!' });
});

// If there is a throw new Error somewhere, it's gonna be caught here in the err
/*This error middleware will automatically catch the error, whether it's synchronous or asynchronous when express-async-errors is installed*/
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
