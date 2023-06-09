import { LocalSaveAccessToken } from './local-save-access-token';
import { SetStorageMock } from '@/data/test/mock-storage';
import { faker } from '@faker-js/faker';

interface SutInterface {
  sut: LocalSaveAccessToken;
  setStorageMock: SetStorageMock;
}

const makeSut = (): SutInterface => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalSaveAccessToken(setStorageMock);

  return {
    sut,
    setStorageMock,
  };
};

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut();
    const accessToken = faker.datatype.uuid();
    await sut.save(accessToken);

    expect(setStorageMock.key).toBe('accessToken');
    expect(setStorageMock.value).toBe(accessToken);
  });

  test('Should throw if SetStorage with throws', async () => {
    const { sut, setStorageMock } = makeSut();
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error());
    const promise = sut.save(faker.datatype.uuid());

    await expect(promise).rejects.toThrow(new Error());
  });
});
