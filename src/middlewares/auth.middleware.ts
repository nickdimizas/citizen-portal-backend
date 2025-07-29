import { Request, Response, NextFunction } from 'express';

import { TokenPayload } from '../types';
import { verifyAccessToken } from '../services/auth.service';
import { StatusCodes } from '../constants/statusCodes';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: false, message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const result = verifyAccessToken(token);

  if (!result.verified) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ status: false, message: 'Invalid or expired token.', data: result.data });
    return;
  }

  req.user = result.data as TokenPayload;
  next();
};

export { verifyToken };
