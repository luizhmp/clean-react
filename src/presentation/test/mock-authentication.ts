import { mockAccountModel } from '@/domain/test';
import { Authentication, AuthenticationParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel();

  params: AuthenticationParams;

  callsCount = 0;

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params;
    this.callsCount++;
    return this.account;
  }
}
