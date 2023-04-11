import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http';
import { Authentication } from '@/domain';
import { RemoteAuthentication } from '@/data/usecases/authentication';

export const makeRemoteAuthentication = (): Authentication => {
  const url = makeApiUrl('/login');
  const remoteAuthentication = new RemoteAuthentication(
    url,
    makeAxiosHttpClient()
  );

  return remoteAuthentication;
};
