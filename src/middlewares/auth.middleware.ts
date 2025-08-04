import { Response, NextFunction } from 'express';

import { verifyAccessToken } from '../services/auth.service';
import { StatusCodes } from '../constants/statusCodes';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { UserRole } from '../models/user.model';

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void | Response => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: 'Access denied. No token provided.',
    });
  }

  const result = verifyAccessToken(token);

  if (!result.verified) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: false,
      message: 'Invalid or expired token.',
      data: result.data,
    });
  }

  req.user = result.data;
  next();
};

const verifyRole = (allowedRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || userRole !== allowedRole) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ status: false, message: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
  };
};

export { verifyToken, verifyRole };
