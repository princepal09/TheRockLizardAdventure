import 'express';

export interface CurrentUserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
     user:CurrentUserPayload
    }
  }
}
