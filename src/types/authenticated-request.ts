import { Request } from 'express';

import { TokenPayload } from './index';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}
