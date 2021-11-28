import express, {
  Request,
  Response,
} from 'express';
import { PackageModel } from '../schema/packageSchema';

const router = express.Router();

router.get('/:trackingId', async (
  req: Request,
  res: Response,
) => {
  const trackingNum: string = req.params.trackingId;

  const response = await PackageModel.deleteOne({
    tracking: trackingNum,
  });

  res.status(200).send(response);
});

export default router;
