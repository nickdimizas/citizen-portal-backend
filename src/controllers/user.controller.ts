import { Response } from 'express';

import { StatusCodes } from '../constants/statusCodes';
import { UserRole } from '../models/user.model';
import { getUsers } from '../services/user.service';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { extractErrorMessage } from '../utils/errorHandler';
import { getUsersQueryValidator } from '../validators/user.validator';

const getUsersController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;

    // Parse and validate query
    const query = getUsersQueryValidator.parse(req.query);

    // Determine allowed roles based on current user
    let allowedRoles: UserRole[] | undefined;
    if (userRole === UserRole.Employee) {
      allowedRoles = [UserRole.Citizen];
    } else if (userRole === UserRole.Admin) {
      allowedRoles = query.roleFilter; // Admin can filter anything
    } else {
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Forbidden',
      });
      return;
    }

    // Inject role filter into service call
    const result = await getUsers({
      ...query,
      roleFilter: allowedRoles,
    });

    res.status(StatusCodes.OK).json({
      status: true,
      message: 'Users fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Failed to fetch users',
      error: errorMessage,
    });
  }
};

export { getUsersController };
