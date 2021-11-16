import { Package } from './package';

export interface User {
  email: string,
  username: string,
  password: string,
  packageList: Package[],
}
