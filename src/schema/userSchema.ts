import { model, Schema } from 'mongoose';

import { packageSchema } from './packageSchema';
import { User } from '../../types/user';

export const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  packageList: [packageSchema],
});

export const UserModel = model<User>(
  'User',
  userSchema,
);
