import express, {
  Response,
} from 'express';
import { PackageModel } from '../schema/packageSchema';
import { UserModel } from '../schema/userSchema';
import { AuthRequest } from '../../types/auth';

const router = express.Router();

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
  const trackingNum: string = req.params.trackingId;

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
