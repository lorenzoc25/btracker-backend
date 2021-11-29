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

  const trackingNum: string = req.params.trackingId;
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

  const response = await getrackingFromDB(trackingNum);

  if (response.length === 0
    || Date.now() - response[0].lastUpdate > 1800) {
    await PackageModel.deleteMany({
      tracking: trackingNum,
    });
    await updateTracking(trackingNum);
    res.status(200).send(await getrackingFromDB(trackingNum));
  } else {
    res.status(200).send(response);
  }
});

export default router;
