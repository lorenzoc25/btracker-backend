import { Carrier } from '../../types/package';

const carrierCodeConversion = (code: string) => {
  const c = code.toLowerCase();
  if (c === 'usps') {
    return Carrier.USPS;
  } if (c === 'ups') {
    return Carrier.UPS;
  } if (c === 'fedex') {
    return Carrier.FedEx;
  } if (c === 'dhl') {
    return Carrier.DHL;
  }
  return c.toUpperCase();
};

export default carrierCodeConversion;
