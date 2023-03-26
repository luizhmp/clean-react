import { InvalidFieldError } from '@/validation/errors';
import { EmailValidation } from '@/validation/validators/email';
import { faker } from '@faker-js/faker';

const makeSut = (): EmailValidation => {
  const sut = new EmailValidation(faker.database.column());

  return sut;
};

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.word());

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if email is valid', () => {
    const sut = makeSut();
    const error = sut.validate(faker.internet.email());

    expect(error).toBeFalsy();
  });
});
