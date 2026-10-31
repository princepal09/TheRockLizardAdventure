type tokenType = 'access' | 'refresh';

export interface IPayload {
  id: string;
  email: string;
  type: tokenType;
}
