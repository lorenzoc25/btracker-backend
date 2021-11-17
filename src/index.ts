import express, { json } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';

import sessionRoute from './routes/session';
import userRoute from './routes/user';

const main = async () => {
  await mongoose.connect(
    'mongodb://127.0.0.1:27017/btracker',
  );
  console.log('The application is connecting to the MongoDB server');

  const app = express();
  app.use(json());
  app.use(compression());

  app.use('/session', sessionRoute);
  app.use('/user', userRoute);

  app.get('/', (_, res) => {
    res.send('btrack backend service');
  });

  app.listen(3000, () => {
    console.log('The application is listening on port 3000');
  });
};

try {
  main();
} catch (error) {
  console.error(error);
}
