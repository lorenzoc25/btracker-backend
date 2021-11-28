import express, {
    Request,
    Response,
  } from 'express';
import { HistoryModel, PackageModel } from '../schema/packageSchema';
import getTrackingInfo from '../functions/getTracking';

const router = express.Router();

router.get('/:trackingId', async (
  req: Request,
  res: Response,
) => {
  const trackingNum: string = req.params.trackingId;
  const info = await getTrackingInfo(trackingNum);

  const histInfo = info.events;
  const history = []

  for (const eventInfo of histInfo) {
    const event = new HistoryModel({
      status: eventInfo.description,
    });
  }

  const delivery = new PackageModel({
    tracking: trackingNum,
    name: "Delivery",
    carrier: info.carrier_code,
    status: info.status_description,
    history: []
  });
  await delivery.save();
  res.status(200).send();
});

export default router;