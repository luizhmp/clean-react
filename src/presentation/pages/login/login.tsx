import React, { useState, useEffect } from 'react';
import Styles from './login-styles.scss';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from '@/presentation/components';
import { FormContext } from '@/presentation/contexts/form';

import { LoginPropsInterface, StateInterface } from './types';

export function Login({ validation }: LoginPropsInterface): JSX.Element {
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation?.validate('email', state.email),
      passwordError: validation?.validate('password', state.password),
    });
  }, [state.email, state.password]);

  const isDisabled = !!state.emailError || !!state.passwordError;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    setState({
      ...state,
      isLoading: true,
    });
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />

          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />

          <button
            data-testid="submit"
            disabled={isDisabled}
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
