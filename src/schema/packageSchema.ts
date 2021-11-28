import { model, Schema } from 'mongoose';

import { History, Package } from '../../types/package';

export const historySchema = new Schema<History>({
  status: {
    type: String,
    required: true,
  },
  message: String,
  location: String,
  timestamp: Number,
});

export const packageSchema = new Schema<Package>({
  tracking: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  carrier: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  history: [historySchema],
});

export const HistoryModel = model<History>(
  'History',
  historySchema,
);

export const PackageModel = model<Package>(
  'Package',
  packageSchema,
);
