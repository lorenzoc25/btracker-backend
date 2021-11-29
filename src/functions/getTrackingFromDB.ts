import { PackageModel } from '../schema/packageSchema';

const getTrackingFromDB = async (trackingNum: string) => {
  const response = await PackageModel.find({
    tracking: trackingNum,
  });

  return response;
};

export default getTrackingFromDB;
