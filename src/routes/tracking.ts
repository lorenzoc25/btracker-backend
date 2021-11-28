import express, {
  Request,
  Response,
} from 'express';
import getrackingFromDB from '../functions/getTrackingFromDB';
import updateTracking from '../functions/updateTracking';

const router = express.Router();

router.get('/:trackingId', async (
  req: Request,
  res: Response,
) => {
  const trackingNum: string = req.params.trackingId;

  const response = await getrackingFromDB(trackingNum);

  if (response.length === 0
    || Date.now() - response[0].lastUpdate > 1800) {
    await updateTracking(trackingNum);
    res.status(200).send(await getrackingFromDB(trackingNum));
  } else {
    res.status(200).send(response);
  }
});

export default router;
