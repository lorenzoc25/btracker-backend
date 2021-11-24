import express, {
  Request,
  Response,
} from 'express';
import bcrypt from 'bcrypt';

import { UserModel } from '../schema/userSchema';

interface UserPostRequest {
  email?: string,
  username?: string,
  password?: string,
}

const router = express.Router();

router.post('/', async (
  req: Request<{}, {}, UserPostRequest>,
  res: Response,
) => {
  const {
    email,
    username,
    password,
  } = req.body;

  if (email === undefined) {
    res.status(400).json({
      message: 'The field \'email\' is missing in the request body',
    });
    return;
  }

  if (username === undefined) {
    res.status(400).json({
      message: 'The field \'username\' is missing in the request body',
    });
    return;
  }

  if (password === undefined) {
    res.status(400).json({
      message: 'The field \'password\' is missing in the request body',
    });
    return;
  }

  const user = new UserModel({
    email,
    username,
    password: await bcrypt.hash(password, 10),
  });
  await user.save();
  res.status(200).send();
});

export default router;
