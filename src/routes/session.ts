import express from 'express';

const router = express.Router();

router.post('/', async (_, res) => {
  res.send('test');
});

export default router;
