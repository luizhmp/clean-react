import { AccountModel } from '../models';

export interface Authentication {
  auth(email: string, password: string): Promise<AccountModel>;
}
