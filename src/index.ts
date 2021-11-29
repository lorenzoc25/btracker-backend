import express, { json } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import jwt from 'express-jwt';
import cors from 'cors';

import dotenv from './boot/env';
import unauthorizedError from './middleware/unauthorized-error';
import sessionRoute from './routes/session';
import userRoute from './routes/user';
import trackingRoute from './routes/tracking';
import deleteTrackingRoute from './routes/deleteTracking';
import updateTrackingRoute from './routes/updateTracking';

const main = async () => {
  if (dotenv) {
    console.log('The environment variables are loaded from the .env file');
  }

  await mongoose.connect(
    'mongodb://127.0.0.1:27017/btracker',
  );
  console.log('The application is connecting to the MongoDB server');

  const app = express();
  app.use(cors({
    origin: [
      'http://localhost:3000',
    ],
    optionsSuccessStatus: 200,
  }));
  app.use(json());
  app.use(compression());
  app.use(jwt({
    secret: process.env.JWT_ENCRYPT_KEY || '',
    algorithms: ['HS256'],
    requestProperty: 'auth',
  }).unless({
    path: [
      {
        url: '/',
      },
      {
        url: '/user',
        methods: ['POST'],
      },
      {
        url: '/session',
        methods: ['POST'],
      },
    ],
  }));
  app.use(unauthorizedError);

  app.use('/session', sessionRoute);
  app.use('/user', userRoute);
  app.use('/tracking', trackingRoute);
  app.use('/deleteTracking', deleteTrackingRoute);
  app.use('/updateTracking', updateTrackingRoute);

  app.get('/', (_, res) => {
    res.send('btrack backend service');
  });

  app.listen(process.env.PORT, () => {
    console.log('The application is listening on port %d', process.env.PORT);
  });
};

try {
  main();
} catch (error) {
  console.error(error);
}
