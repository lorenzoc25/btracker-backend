import express, {
  Response,
} from 'express';

import getrackingFromDB from '../functions/getTrackingFromDB';
import updateTracking from '../functions/updateTracking';
import { AuthRequest } from '../../types/auth';
import { PackageModel } from '../schema/packageSchema';
import { UserModel } from '../schema/userSchema';

const router = express.Router();

router.get('/:trackingId', async (
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

  const trackingNum = req.params.trackingId;
  const userEmail = req.auth.email;

  try {
    const response = await getrackingFromDB(trackingNum);
    if (
      response.length === 0
      || Date.now() - response[0].lastUpdate > 1800
    ) {
      await PackageModel.deleteMany({
        tracking: trackingNum,
      });
      await updateTracking(trackingNum);
      await UserModel.findOneAndUpdate(
        {
          email: userEmail,
        },
        {
          $addToSet: {
            packageList: trackingNum,
          },
        },
      );
      res.status(200).send(await getrackingFromDB(trackingNum));
    } else {
      res.status(200).send(response);
    }
  } catch {
    res.status(400).json({
      message: 'Invalid Tracking Number',
    });
  }
});

router.put('/:trackingId', async (
  req: AuthRequest,
  res: Response,
) => {
  if (req.body === undefined) {
    res.status(400).json({
      message: 'The field \'tracking\' and \'name\' are missing in the request body',
    });
    return;
  }

  const {
    tracking,
    name,
  } = req.body;

  if (tracking === undefined) {
    res.status(400).json({
      message: 'The field \'tracking\' is missing in the request body',
    });
    return;
  }

  if (name === undefined) {
    res.status(400).json({
      message: 'The field \'name\' is missing in the request body',
    });
    return;
  }

  const filter = { tracking };
  const update = { name };

  const response = await PackageModel.findOneAndUpdate(
    filter,
    update,
  );

  res.status(200).send(response);
});

router.delete('/:trackingId', async (
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
  const trackingNum = req.params.trackingId;

  const userEmail = req.auth.email;
  await UserModel.findOneAndUpdate(
    {
      email: userEmail,
    },
    {
      $pull: {
        packageList: trackingNum,
      },
    },
  );

  const response = await PackageModel.deleteMany({
    tracking: trackingNum,
  });

  res.status(200).send(response);
});

export default router;
