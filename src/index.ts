import express, { json } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';

import dev from './boots/env';
import sessionRoute from './routes/session';
import userRoute from './routes/user';
import trackingRoute from './routes/tracking';
import deleteTrackingRoute from './routes/deleteTracking';
import updateTrackingRoute from './routes/updateTracking';

const main = async () => {
  if (dev) {
    console.log('Loaded the env variables');
  }
  await mongoose.connect(
    'mongodb://127.0.0.1:27017/btracker',
  );
  console.log('The application is connecting to the MongoDB server');

  const app = express();
  app.use(json());
  app.use(compression());

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
