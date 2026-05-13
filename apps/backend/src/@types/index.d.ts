import { UserPayload } from './path-to-your-payload-interface';

export {};

declare global {
  namespace Express {
    interface Request {
      // Use o UserPayload aqui em vez de definir o objeto manualmente
      user?: UserPayload;
    }
  }
}
