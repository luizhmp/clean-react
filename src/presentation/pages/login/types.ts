import { Authentication } from '@/domain/usecases';
import { Validation } from '@/presentation/protocols/validation';

export interface LoginPropsInterface {
  validation: Validation;
  authentication: Authentication;
}

export interface StateInterface {
  isLoading: boolean;
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  mainError: string;
}
