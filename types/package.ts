export interface History {
  status: string;
  location: string;
  message: string;
  timestamp: number;
}

export enum Status {
  LabelCreated = 'Label Created',
  InTransit = 'In Transit',
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
  lastUpdate: number;
}
