import { faker } from '@faker-js/faker';
import { AccountModel } from '../models';

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.random.alphaNumeric(),
});
