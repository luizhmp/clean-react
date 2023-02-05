import { mockAuthentication } from '@/domain/test';
import { HttpPostClientSpy } from '@/data/test/mock-http-client';
import { RemoteAuthentication } from '@/data/usecases/authentication';
import { faker } from '@faker-js/faker';

interface SutInterface {
  sut: RemoteAuthentication;
  httpPostClientSpy: HttpPostClientSpy;
}

const makeSut = (url = faker.internet.url()): SutInterface => {
  const httpPostClientSpy = new HttpPostClientSpy();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);

  return {
    sut,
    httpPostClientSpy,
  };
};

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);
    await sut.auth(mockAuthentication());

    expect(httpPostClientSpy.url).toBe(url);
  });

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut();
    const authenticationParams = mockAuthentication();
    await sut.auth(authenticationParams);

    expect(httpPostClientSpy.body).toEqual(authenticationParams);
  });
});
