import React from 'react';
import { Login } from '@/presentation/pages';
import { RemoteAuthentication } from '@/data/usecases/authentication';
import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client';
import { ValidationBuilder } from '@/validation/validators/builder';
import { ValidationComposite } from '@/validation/validators';

export const makeLogin = (): JSX.Element => {
  const url = 'http://fordevs.herokuapp.com/api/login';
  const axiosHttpClient = new AxiosHttpClient();
  const remoteAuthentication = new RemoteAuthentication(url, axiosHttpClient);
  const validationComposite = ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().minLength(5).build(),
  ]);

  return (
    <Login
      authentication={remoteAuthentication}
      validation={validationComposite}
    />
  );
};
