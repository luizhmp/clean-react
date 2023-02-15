import React, { useState } from 'react';
import Styles from './login-styles.scss';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from '@/presentation/components';
import { FormContext } from '@/presentation/contexts/form';

import { StatePropsInterface } from './types';

export function Login(): JSX.Element {
  const [state] = useState<StatePropsInterface>({
    isLoading: false,
    errorMessage: '',
  });

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <FormContext.Provider value={state}>
        <form className={Styles.form}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />

          <Input type="password" name="senha" placeholder="Digite sua senha" />

          <button
            data-testid="submit"
            disabled
            className={Styles.submit}
            type="submit"
          >
            Entrar
          </button>

          <span className={Styles.link}>Criar conta</span>

          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  );
}
