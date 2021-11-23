import express, {
  Request,
  Response,
} from 'express';

import Easypost from '@easypost/api';

const easypostAPI = new Easypost(process.env.EASYPOST_API_KEY);

const router = express.Router();

router.get('/:trackingId', async (
  req: Request,
  res: Response,
) => {
  const trackingNumber: string = req.params.trackingId;
  try {
    const tracker = new easypostAPI.Tracker({
      tracking_code: trackingNumber,
      carrier: 'UPS',
    });

    await tracker.save();
  } catch (err) {
    console.log('FUCK YOU! this is not UPS');
    console.log(err);
  }

  try {
    const tracker = new easypostAPI.Tracker({
      tracking_code: trackingNumber,
      carrier: 'USPS',
    });

    await tracker.save();
  } catch (err) {
    console.log('FUCK YOU! this is not USPS');
    console.log(err);
  }

  res.status(200).send();
});

export default router;
