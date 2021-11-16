import express from 'express';
import compression from 'compression';

import sessionRoute from './routes/session';
import userRoute from './routes/user';

const main = async () => {
  const app = express();
  app.use(compression());

  app.use('/session', sessionRoute);
  app.use('/user', userRoute);

  app.get('/test', (_, res) => {
    res.send('Test');
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
