import { Validation } from '@/presentation/protocols/validation';
import { FieldValidation } from '@/validation/protocols';

export class ValidationComposite implements Validation {
  private constructor(private readonly validators: FieldValidation[]) {}

  static build(validators: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validators);
  }

  validate(fieldName: string, fieldValue: string): string {
    const filteredValidators = this.validators.filter(
      (validator) => validator.field === fieldName
    );
    for (const validator of filteredValidators) {
      const error = validator.validate(fieldValue);

      if (error) {
        return error.message;
      }
    }
  }
}
