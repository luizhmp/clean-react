import { faker } from '@faker-js/faker';
import { AccountModel } from '@/domain/models';

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.random.word(),
});
