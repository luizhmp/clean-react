import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Login } from '@/presentation/pages';
import {
  AuthenticationSpy,
  SaveAccessTokenMock,
  ValidationStub,
} from '@/presentation/test';
import { faker } from '@faker-js/faker';
import { InvalidCredentialsError } from '@/domain/errors';

interface SutInterface {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
}

interface SutParams {
  validationError: string;
}

const makeSut = (params?: SutParams): SutInterface => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const saveAccessTokenMock = new SaveAccessTokenMock();

  const sut = render(
    <BrowserRouter>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </BrowserRouter>
  );

  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock,
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

const simulateValidSubmit = async (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  populateEmailField(sut, email);

  populatePasswordField(sut, password);

  const form = sut.getByTestId('form');
  fireEvent.submit(form);
  await waitFor(() => form);
};

const testStatusForField = (
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

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap');

  expect(errorWrap.childElementCount).toBe(count);
};

const testIfElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName);

  expect(element).toBeTruthy();
};

const testIfButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;

  expect(button.disabled).toBe(isDisabled);
};

const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const element = sut.getByTestId(fieldName);

  expect(element.textContent).toBe(text);
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    testErrorWrapChildCount(sut, 0);
    testIfButtonIsDisabled(sut, 'submit', true);

    testStatusForField(sut, 'email', validationError);

    testStatusForField(sut, 'password', validationError);
  });

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populateEmailField(sut);
    testStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populatePasswordField(sut);
    testStatusForField(sut, 'password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();
    populateEmailField(sut);
    testStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();
    populatePasswordField(sut);
    testStatusForField(sut, 'password');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();
    populatePasswordField(sut);
    populateEmailField(sut);

    testIfButtonIsDisabled(sut, 'submit', false);
  });

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut();
    await simulateValidSubmit(sut);
    testIfElementExists(sut, 'spinner');
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });

  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut();
    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('Should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest
      .spyOn(authenticationSpy, 'auth')
      .mockReturnValueOnce(Promise.reject(error));
    await simulateValidSubmit(sut);

    await waitFor(() => sut.getByTestId('main-error'));

    testElementText(sut, 'main-error', error.message);

    testErrorWrapChildCount(sut, 1);
  });

  test('Should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();

    await simulateValidSubmit(sut);

    expect(saveAccessTokenMock.accessToken).toBe(
      authenticationSpy.account.accessToken
    );
    expect(history.length).toEqual(1);
    expect(location.pathname).toEqual('/');
  });

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut();
    const error = new InvalidCredentialsError();
    jest
      .spyOn(saveAccessTokenMock, 'save')
      .mockReturnValueOnce(Promise.reject(error));
    await simulateValidSubmit(sut);

    await waitFor(() => sut.getByTestId('main-error'));

    testElementText(sut, 'main-error', error.message);

    testErrorWrapChildCount(sut, 1);
  });

  test('Should go to signup page', () => {
    const { sut } = makeSut();

    const signup = sut.getByTestId('signup');
    fireEvent.click(signup);

    expect(history.length).toEqual(2);
    expect(location.pathname).toEqual('/signup');
  });
});
