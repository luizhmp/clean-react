import { SaveAccessToken } from '@/domain';

export class SaveAccessTokenMock implements SaveAccessToken {
  accessToken: string;

  async save(accessToken: string): Promise<void> {
    this.accessToken = accessToken;
  }
}
