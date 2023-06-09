import { ValidationComposite } from './validation-composite';
import { FieldValidationSpy } from '@/validation/test';
import { faker } from '@faker-js/faker';

interface SutInterface {
  sut: ValidationComposite;
  fieldValidationsSpy: FieldValidationSpy[];
}

const makeSut = (fieldName: string): SutInterface => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName),
  ];
  const sut = ValidationComposite.build(fieldValidationsSpy);

  return {
    sut,
    fieldValidationsSpy,
  };
};

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.database.column();
    const { sut, fieldValidationsSpy } = makeSut(fieldName);
    const errorMessage = faker.random.words();
    fieldValidationsSpy[0].error = new Error(errorMessage);
    fieldValidationsSpy[1].error = new Error(faker.random.words());

    const error = sut.validate(fieldName, faker.random.word());

    expect(error).toBe(errorMessage);
  });

  test('Should return falsy if there is no error', () => {
    const fieldName = faker.database.column();
    const { sut } = makeSut(fieldName);
    const success = sut.validate(fieldName, faker.random.word());

    expect(success).toBeFalsy();
  });
});
