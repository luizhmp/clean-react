import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './login-styles.scss';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from '@/presentation/components';
import { FormContext } from '@/presentation/contexts/form';

import { LoginPropsInterface, StateInterface } from './types';
import { act } from 'react-dom/test-utils';

export function Login({
  validation,
  authentication,
}: LoginPropsInterface): JSX.Element {
  const navigate = useNavigate();
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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    try {
      const shouldReturn =
        state.isLoading || state.emailError || state.passwordError;

      if (shouldReturn) {
        return;
      }

      setState({
        ...state,
        isLoading: true,
      });
      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      });

      localStorage.setItem('accessToken', account.accessToken);
      act(() => navigate('/', { replace: true }));
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message,
      });
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}
        >
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

          <Link data-testid="signup" to="/signup" className={Styles.link}>
            Criar conta
          </Link>

          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  );
}
