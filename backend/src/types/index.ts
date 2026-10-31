export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

type tokenType = 'access' | 'refresh';

export interface IPayload {
  id: string;
  email: string;
  type: tokenType;
}
