import axios from 'axios';
import { faker } from '@faker-js/faker';

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedAxiosResult = {
    data: {
      [`${faker.helpers.objectKey}`]: faker.helpers.objectValue,
    },
    status: faker.random.numeric(),
  };

  mockedAxios.post.mockResolvedValue(mockedAxiosResult);

  return mockedAxios;
};
