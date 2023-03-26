import { RequiredFieldError } from '@/validation/errors';
import { RequiredFieldValidation } from '@/validation/required-field';
import { faker } from '@faker-js/faker';

const makeSut = () => {
  const sut = new RequiredFieldValidation(faker.database.column());

  return sut;
};

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = makeSut();
    const error = sut.validate('');

    expect(error).toEqual(new RequiredFieldError());
  });

  test('Should return falsy if field is not empty', () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.word());

    expect(error).toBeFalsy();
  });
});
