export interface History {
  status: string;
  location: string;
  timestamp: number;
}

export enum Status {
  LabelCreated = 'Label Created',
  InTransit = 'In Transit',
  OutOfDelivery = 'Out of Delivery',
  Delivered = 'Delivered',
}

export enum Carrier {
  USPS = 'USPS',
  UPS = 'UPS',
  DHL = 'DHL',
  FedEx = 'FedEx',
}

export interface Package {
  tracking: string;
  name: string;
  carrier: Carrier;
  history: History[];
  status: Status;
}
