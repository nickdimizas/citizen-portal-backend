import { Response, NextFunction } from 'express';

import { verifyAccessToken } from '../services/auth.service';
import { StatusCodes } from '../constants/statusCodes';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { User, UserRole } from '../models/user.model';
import { extractErrorMessage } from '../utils/errorHandler';

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      console.warn('Access denied: no token provided');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const result = verifyAccessToken(token);

    if (!result.verified) {
      console.warn('Invalid or expired token:', result.data);
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Invalid or expired token.',
        data: result.data,
      });
      return;
    }

    const dbUser = await User.findById(result.data.id);
    if (!dbUser || !dbUser.active) {
      console.warn(`User inactive or missing: ${result.data.id}`);
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'User is inactive or no longer exists.',
      });
      return;
    }

    req.user = result.data;
    next();
  } catch (error) {
    console.error('Internal error while verifying token:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Internal error while verifying token.',
      error: errorMessage,
    });
  }
};

const verifyRole = (allowedRoles: UserRole | UserRole[]) => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role as UserRole | undefined;

    if (!userRole || !rolesArray.includes(userRole)) {
      console.warn(`Forbidden: role ${userRole} not in allowed roles`);
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Forbidden: insufficient permissions',
      });
      return;
    }

    next();
  };
};

export { verifyToken, verifyRole };
