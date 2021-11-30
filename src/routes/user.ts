import express, {
  Request,
  Response,
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';

import { UserModel } from '../schema/userSchema';
import { AuthRequest } from '../../types/auth';
import { PackageModel } from '../schema/packageSchema';
import { Package } from '../../types/package';

import getrackingFromDB from '../functions/getTrackingFromDB';
import updateTracking from '../functions/updateTracking';

interface UserPostRequest {
  email?: string,
  username?: string,
  password?: string,
}

const comparator = (package1: Package, package2: Package) => {
  if (package1.tracking > package2.tracking) {
    return -1;
  }
  return 1;
};

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

router.get('/tracking', async (
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

  const user = await UserModel.findOne(
    {
      email: req.auth.email,
    },
  );

  if (user === null) {
    res.status(400).json({
      message: 'The user is not exist in the database',
    });
    return;
  }

  const trackingList: HydratedDocument<Package>[] = [];
  const trackingNums = user.packageList;
  await Promise.all(trackingNums.map(async (
    tracking: string,
  ) => {
    const trackingInfo = await PackageModel.findOne(
      {
        tracking,
      },
    );
    if (trackingInfo === null) {
      return;
    }
    if (Date.now() - trackingInfo[0].lastUpdate < 1800 * 1000) {
      trackingList.push(trackingInfo[0]);
    } else {
      const { name } = trackingInfo[0];
      await PackageModel.deleteMany({
        tracking,
      });
      await updateTracking(tracking, name);
      const newInfo = await getrackingFromDB(tracking);
      trackingList.push(newInfo[0]);
    }
  }));
  trackingList.sort(comparator);
  res.status(200).send(trackingList);
});

export default router;
