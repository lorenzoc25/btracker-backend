import express, {
  Request,
  Response,
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

  const count = await UserModel.countDocuments({
    email,
  }).exec();
  if (count > 0) {
    res.status(409).json({
      message: 'The user exists in the database',
    });
    return;
  }

  const user = new UserModel({
    email,
    username,
    password: await bcrypt.hash(password, 10),
  });
  await user.save();

  const encryptKey = process.env.JWT_ENCRYPT_KEY;
  if (encryptKey === undefined) {
    res.status(500).json({
      message: 'The JWT_ENCRYPT_KEY is not present in the .env file',
    });
    return;
  }

  const token = jwt.sign(
    {
      email: user.email,
    },
    encryptKey,
  );
  res.status(200).json({
    token,
    email: user.email,
    username: user.username,
  });
});

export default router;
