import { RequiredFieldError } from '@/validation/errors';
import { RequiredFieldValidation } from '@/validation/required-field';

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = new RequiredFieldValidation('email');
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError());
  });
});
