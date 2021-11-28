import express, {
  Request,
  Response,
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '../schema/userSchema';
import { AuthRequest } from '../../types/auth';

interface SessionPostRequest {
  email?: string,
  password?: string,
}

const router = express.Router();

router.get('/', async (
  req: AuthRequest,
  res: Response,
) => {
  if (
    req.auth === undefined
    || req.auth.email === undefined
  ) {
    res.status(403).json({
      message: 'The access token is missing or invalid',
    });
    return;
  }
  res.status(200).json({
    email: req.auth.email,
  });
});

router.post('/', async (
  req: Request<{}, {}, SessionPostRequest>,
  res: Response,
) => {
  const {
    email,
    password,
  } = req.body;

  if (email === undefined) {
    res.status(400).json({
      message: 'The field \'email\' is missing in the request body',
    });
    return;
  }

  if (password === undefined) {
    res.status(400).json({
      message: 'The field \'password\' is missing in the request body',
    });
    return;
  }

  const user = await UserModel.findOne({
    email,
  }).select({
    email: 1,
    password: 1,
    username: 1,
  }).exec();

  if (user === null) {
    res.status(404).json({
      message: 'The user does not exist in the database',
    });
    return;
  }

  const authenticate = await bcrypt.compare(
    password,
    user.password,
  );

  const encryptKey = process.env.JWT_ENCRYPT_KEY;
  if (encryptKey === undefined) {
    res.status(500).json({
      message: 'The JWT_ENCRYPT_KEY is not present in the .env file',
    });
    return;
  }

  if (authenticate) {
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
  } else {
    res.status(401).json({
      message: 'The password does not match the record in the database',
    });
  }
});

export default router;
