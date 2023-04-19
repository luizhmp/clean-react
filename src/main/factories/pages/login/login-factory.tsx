import React from 'react';
import { Login } from '@/presentation/pages';
import { makeRemoteAuthentication } from '@/main/factories/usecases/authentication';
import { makeLoginValidation } from './login-validation-factory';
import { makeLocalSaveAccessToken } from '../../usecases/save-access-token';

export const makeLogin = (): JSX.Element => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  );
};
