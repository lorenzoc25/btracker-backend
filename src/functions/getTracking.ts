import axios from 'axios';

async function getTracking(trackingNum: string) {
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
  return response.data;
}

export default getTracking;
