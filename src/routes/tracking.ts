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

  const carrierName = carrierResponse.data.data[0].code;
  const trackingQuery = `?carrier_code=${carrierName}&tracking_number=${trackingNum}`;

  const shipEngine = axios.create({
    baseURL: process.env.SHIPENGINE_API,
    headers: {
      'API-Key': process.env.SHIPENGINE_API_KEY,
    },
  });

  const response = await shipEngine.get(
    trackingQuery,
  );
  res.status(200).send(response.data);
});

export default router;
