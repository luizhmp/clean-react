import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import 'jest-localstorage-mock';
import { Login } from './login';
import { AuthenticationSpy, ValidationStub } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import { InvalidCredentialsError } from '@/domain/errors';

interface SutInterface {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
}

interface SutParams {
  validationError: string;
}

const makeSut = (params?: SutParams): SutInterface => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;

  const sut = render(
    <BrowserRouter>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </BrowserRouter>
  );

  return {
    sut,
    authenticationSpy,
  };
};

const populatePasswordField = (
  sut: RenderResult,
  password: string = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId('password');

  fireEvent.change(passwordInput, {
    target: { value: password },
  });
};

const populateEmailField = (
  sut: RenderResult,
  email: string = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId('email');

  fireEvent.change(emailInput, {
    target: { value: email },
  });
};

const simulateValidSubmit = (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): void => {
  populateEmailField(sut, email);

  populatePasswordField(sut, password);

  const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
  fireEvent.click(submitButton);
};

const simulateStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);

  const expectedTitle = validationError || 'Tudo certo!';
  const expectedTextContent = validationError ? '🔴' : '🟢';

  expect(fieldStatus.title).toBe(expectedTitle);
  expect(fieldStatus.textContent).toBe(expectedTextContent);
};

describe('Login Component', () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
  });

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    const errorWrap = sut.getByTestId('error-wrap');

    expect(errorWrap.childElementCount).toBe(0);

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);

    simulateStatusForField(sut, 'email', validationError);

    simulateStatusForField(sut, 'password', validationError);
  });

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populateEmailField(sut);
    simulateStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populatePasswordField(sut);
    simulateStatusForField(sut, 'password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();
    populateEmailField(sut);
    simulateStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();
    populatePasswordField(sut);
    simulateStatusForField(sut, 'password');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();
    populatePasswordField(sut);
    populateEmailField(sut);

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(false);
  });

  test('Should show spinner on submit', () => {
    const { sut } = makeSut();
    simulateValidSubmit(sut);
    const spinner = sut.getByTestId('spinner');

    expect(spinner).toBeTruthy();
  });

  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();

    simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });

  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut();
    simulateValidSubmit(sut);
    simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });
    populateEmailField(sut);
    const form = sut.getByTestId('form');
    fireEvent.submit(form);

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest
      .spyOn(authenticationSpy, 'auth')
      .mockReturnValueOnce(Promise.reject(error));
    simulateValidSubmit(sut);

    const errorWrap = sut.getByTestId('error-wrap');

    await waitFor(() => sut.getByTestId('main-error'));

    const mainError = sut.getByTestId('main-error');

    expect(mainError.textContent).toBe(error.message);

    expect(errorWrap.childElementCount).toBe(1);
  });

  test('Should add accessToken to localStorage on success', async () => {
    const { sut } = makeSut();

    simulateValidSubmit(sut);

    await waitFor(() => sut.getByTestId('form'));

    expect(history.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(location.pathname).toEqual('/');
  });

  test('Should go to signup page', () => {
    const { sut } = makeSut();

    const signup = sut.getByTestId('signup');
    fireEvent.click(signup);

    expect(history.length).toEqual(2);
    expect(location.pathname).toEqual('/signup');
  });
});
