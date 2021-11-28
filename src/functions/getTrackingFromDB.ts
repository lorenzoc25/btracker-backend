import { PackageModel } from '../schema/packageSchema';

async function getTrackingFromDB(trackingNum: string) {
  const response = await PackageModel.find({
    tracking: trackingNum,
  });

  return response;
}

export default getTrackingFromDB;
