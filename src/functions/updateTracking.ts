import { Document, Types } from 'mongoose';
import { HistoryModel, PackageModel } from '../schema/packageSchema';
import getTrackingInfo from './getTracking';
import { History } from '../../types/package';

async function updateTracking(trackingNum: string) {
  const info = await getTrackingInfo(trackingNum);

  const histEvents = info.events;
  const historyList: (Document<any, any, History> & History & { _id: Types.ObjectId; })[] = [];

  histEvents.forEach((histEvent: {
    description: string;
    city_locality: string;
    occurred_at: string;
  }) => {
    const history = new HistoryModel({
      status: histEvent.description,
      location: histEvent.city_locality,
      timestamp: Date.parse(histEvent.occurred_at), // 2021-11-22T14:46:00Z
    });
    historyList.push(history);
  });

  const delivery = new PackageModel({
    tracking: trackingNum,
    name: 'Delivery',
    carrier: info.carrier_code,
    status: info.status_description,
    lastUpdate: Date.now(),
    history: historyList,
  });

  await delivery.save();
  return delivery;
}

export default updateTracking;
