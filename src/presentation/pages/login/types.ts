import { Validation } from '@/presentation/protocols/validation';

export interface LoginPropsInterface {
  validation?: Validation;
}

export interface StateInterface {
  isLoading: boolean;
  email: string;
  emailError: string;
  passwordError: string;
  mainError: string;
}
