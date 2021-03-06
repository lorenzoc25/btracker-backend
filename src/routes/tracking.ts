import express, {
  Request,
  Response,
} from 'express';

import getrackingFromDB from '../functions/getTrackingFromDB';
import updateTracking from '../functions/updateTracking';
import { AuthRequest } from '../../types/auth';
import { PackageModel } from '../schema/packageSchema';
import { UserModel } from '../schema/userSchema';

const router = express.Router();

router.get('/:trackingId', async (
  req: Request,
  res: Response,
) => {
  const trackingNum = req.params.trackingId;

  try {
    const response = await getrackingFromDB(trackingNum);
    if (response.length === 0) {
      res.status(404).json({
        message: 'Package not found',
      });
    }
    if (Date.now() - response[0].lastUpdate < 1800 * 1000) {
      res.status(200).send(response[0]);
    } else {
      const { name } = response[0];
      await PackageModel.deleteMany({
        tracking: trackingNum,
      });
      await updateTracking(trackingNum, name);
      const trackingInfo = await getrackingFromDB(trackingNum);
      res.status(200).send(trackingInfo[0]);
    }
  } catch {
    res.status(400).send();
  }
});

router.post('/:trackingId', async (
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
      $addToSet: {
        packageList: trackingNum,
      },
    },
  );

  try {
    const response = await getrackingFromDB(trackingNum);
    if (
      response.length === 0
    ) {
      await updateTracking(trackingNum);
      const trackingInfo = await getrackingFromDB(trackingNum);
      res.status(200).send(trackingInfo[0]);
    } else {
      res.status(200).send(response[0]);
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
  if (response === null) {
    res.status(404).json({
      message: 'No tracking number found',
    });
    return;
  }
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
