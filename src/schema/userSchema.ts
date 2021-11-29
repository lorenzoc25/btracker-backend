import { model, Schema } from 'mongoose';

import { User } from '../../types/user';

export const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  packageList: {
    type: [String],
    default: [],
  },
});

export const UserModel = model<User>(
  'User',
  userSchema,
);
