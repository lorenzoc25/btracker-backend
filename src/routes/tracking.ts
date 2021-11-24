import axios from 'axios';
import express, {
  Request,
  Response,
} from 'express';

const router = express.Router();

router.get('/:trackingId', async (
  req: Request,
  res: Response,
) => {
  const trackingNum: string = req.params.trackingId;
  if (process.env.TRACKING_API_KEY == null
    || process.env.DETECT_API == null
    || process.env.SHIPENGINE_API_KEY == null
    || process.env.SHIPENGINE_API == null) {
    throw new Error('Env variable is not loaded');
  }
  const trackingMore = axios.create({
    headers: {
      'Trackingmore-Api-Key': process.env.TRACKING_API_KEY,
    },
  });
  const carrierResponse = await trackingMore.post(
    process.env.DETECT_API,
    {
      tracking_number: trackingNum,
    },
  );

  // const carrierName = carrierResponse.data.data.code;

  res.status(200).send(carrierResponse.data.data);
});

export default router;
