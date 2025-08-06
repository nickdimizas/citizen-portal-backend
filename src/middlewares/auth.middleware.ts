import { Response, NextFunction } from 'express';

import { verifyAccessToken } from '../services/auth.service';
import { findUserByUsernameOrEmail } from '../services/user.service';
import { StatusCodes } from '../constants/statusCodes';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { UserRole } from '../models/user.model';
import { extractErrorMessage } from '../utils/errorHandler';

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const result = verifyAccessToken(token);

    if (!result.verified) {
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Invalid or expired token.',
        data: result.data,
      });
      return;
    }

    const dbUser = await findUserByUsernameOrEmail(result.data.username);
    if (!dbUser || !dbUser.active) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'User is inactive or no longer exists.',
      });
      return;
    }

    req.user = result.data;
    next();
  } catch (error) {
    const errorMessage = extractErrorMessage(error as Error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Internal error while verifying token.',
      error: errorMessage,
    });
  }
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
