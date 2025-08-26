import { Response } from 'express';
import { ZodError } from 'zod';

import { StatusCodes } from '../constants/statusCodes';
import { IUser, User, UserRole } from '../models/user.model';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUser,
} from '../services/user.service';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { extractErrorMessage } from '../utils/errorHandler';
import {
  createUserValidator,
  getUsersQueryValidator,
  updateUserValidator,
  changePasswordValidator,
} from '../validators/user.validator';
import { comparePasswords } from '../utils/password';

const createUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Unauthorized: Missing user information',
      });
      return;
    }

    console.log(`Create user requested by userId: ${req.user?.id}, role: ${req.user?.role}`);

    if (req.user.role === UserRole.Employee && req.body.role !== UserRole.Citizen) {
      console.warn(
        `Role restriction: Employee with id: ${req.user.id} attempted to create a user with role "${req.body.role}".`,
      );
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Employees are only allowed to create citizens',
      });
      return;
    }

    const inputData = {
      ...req.body,
      role:
        req.user.role === UserRole.Employee && !req.body.role ? UserRole.Citizen : req.body.role,
    };

    const validatedData = createUserValidator.parse(inputData);
    console.log(`Validated create user data`);

    await createUser(validatedData);
    console.log(`User created successfully: ${validatedData.username} (${validatedData.role})`);
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: 'User created successfully', data: validatedData.username });
  } catch (error) {
    console.error('User creation error:', error);

    let errorData: { field: string; message: string }[] = [];

    if (error instanceof ZodError) {
      errorData = error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
    } else {
      errorData.push({ field: '', message: extractErrorMessage(error as Error) });
    }

    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: 'User creation failed', data: errorData });
  }
};

const getUsersController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    console.log(`Fetching users - requester role: ${userRole}`);

    const query = getUsersQueryValidator.parse(req.query);

    let allowedRoles: UserRole[] | undefined;
    if (userRole === UserRole.Employee) {
      allowedRoles = [UserRole.Citizen];
    } else if (userRole === UserRole.Admin) {
      allowedRoles = query.roleFilter;
    } else {
      console.warn(`Forbidden access attempt to getUsers by role: ${userRole}`);
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

    const usersWithId = {
      ...result,
      users: result.users.map((u) => ({ ...u.toObject(), id: u._id })),
    };

    console.log(`Users fetched successfully for role ${userRole}`);
    res.status(StatusCodes.OK).json({
      status: true,
      message: 'Users fetched successfully',
      payload: usersWithId,
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

const getUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // ✅ Ensure user is authenticated
    if (!req.user) {
      console.warn('Unauthorized access attempt: missing user object');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Unauthorized',
      });
      return;
    }

    // ✅ Decide target user ID based on role & route
    const isSelfRequest = !req.params.id || req.user.role === UserRole.Citizen;
    const targetUserId = isSelfRequest ? req.user.id : req.params.id;

    console.log(`Fetching user ${targetUserId} - requested by ${req.user.id} (${req.user.role})`);

    const user = await getUserById(targetUserId);

    if (!user) {
      console.warn(`User with id ${targetUserId} not found`);
      res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: 'User not found',
      });
      return;
    }

    // ✅ Restrict employees from accessing non-citizens (unless self-request)
    if (!isSelfRequest && req.user.role === UserRole.Employee && user.role !== UserRole.Citizen) {
      console.warn(`Forbidden access: employee ${req.user.id} tried to access ${targetUserId}`);
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Forbidden: Employees can only access citizen profiles',
      });
      return;
    }

    console.log(`User ${targetUserId} fetched successfully`);
    res.status(StatusCodes.OK).json({
      status: true,
      message: isSelfRequest ? 'Your profile fetched successfully' : 'User fetched successfully',
      data: { ...user.toObject(), id: user._id },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Failed to fetch user',
      error: errorMessage,
    });
  }
};

const updateUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      console.warn('Unauthorized update attempt: missing user id or role');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Unauthorized: Missing user data in request',
      });
      return;
    }

    const targetUserId = req.params.id && req.user.role !== 'citizen' ? req.params.id : req.user.id;
    console.log(`Update user requested by ${req.user.id} for target user ${targetUserId}`);

    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
      console.warn(`Update failed: target user ${targetUserId} not found`);
      res.status(404).json({ status: false, message: 'User not found' });
      return;
    }

    if (req.user.role === UserRole.Citizen && targetUserId !== req.user.id) {
      console.warn(`Forbidden update attempt by citizen ${req.user.id} on user ${targetUserId}`);
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ status: false, message: 'Forbidden: You dont have permission' });
      return;
    }

    if (
      req.user.role === UserRole.Employee &&
      targetUser.role !== UserRole.Citizen &&
      targetUserId !== req.user.id
    ) {
      console.warn(
        `Forbidden update attempt by employee ${req.user.id} on non-citizen user ${targetUserId}`,
      );
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ status: false, message: 'Forbidden: You dont have permission' });
      return;
    }

    const validatedData = updateUserValidator.parse(req.body);
    console.log(`Validated data for update by ${req.user.id} on user ${targetUserId}`);

    const targetUserObj: Partial<IUser> = targetUser.toObject();

    const validatedPartialData = validatedData as Partial<IUser>;

    const hasChanges = Object.keys(validatedPartialData).some((key) => {
      const inputKey = key as keyof IUser;

      if (!(inputKey in targetUserObj)) return false;

      return (
        JSON.stringify(validatedPartialData[inputKey]) !== JSON.stringify(targetUserObj[inputKey])
      );
    });

    if (!hasChanges) {
      res.status(StatusCodes.OK).json({
        status: true,
        message: 'Nothing to update',
      });
      return;
    }

    const updatedUser = await updateUser(targetUserId, validatedData);

    console.log(`User ${targetUserId} updated successfully by ${req.user.id}`);
    res.status(StatusCodes.OK).json({
      status: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);

    let errorData: { field: string; message: string }[] = [];

    if (error instanceof ZodError) {
      errorData = error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
    } else {
      errorData.push({ field: '', message: extractErrorMessage(error as Error) });
    }

    res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: 'Failed to update user',
      error: errorData,
    });
  }
};

const deleteUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (req.user.role !== UserRole.Admin) {
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Forbidden: Only admins can delete users',
      });
      return;
    }

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: 'User not found',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: `User ${deletedUser.username} deleted successfully`,
      data: {
        id: deletedUser.id,
        username: deletedUser.username,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Failed to delete user',
      error: errorMessage,
    });
  }
};

const toggleUserActiveController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      console.warn('Unauthorized access attempt: missing user object');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Unauthorized',
      });
      return;
    }

    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: 'User not found',
      });
      return;
    }

    if (req.user.role === UserRole.Employee && user.role !== UserRole.Citizen) {
      res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        message: 'Employees can only toggle citizens',
      });
      return;
    }

    // Toggle the active field
    user.active = !user.active;
    await user.save();

    res.status(StatusCodes.OK).json({
      status: true,
      message: user.active
        ? `User ${user.username} reactivated successfully`
        : `User ${user.username} deactivated successfully`,
      data: {
        id: user.id,
        username: user.username,
        active: user.active,
      },
    });
  } catch (error) {
    console.error('Error toggling user active status:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Failed to toggle user active status',
      error: errorMessage,
    });
  }
};

const changeUserRoleController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'Invalid role',
      });
      return;
    }

    const user = await getUserById(id);

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: 'User not found',
      });
      return;
    }

    user.role = role;
    await user.save();

    res.status(StatusCodes.OK).json({
      status: true,
      message: `Role for ${user.username} changed to ${role}`,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error changing user role:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Failed to change role',
      error: errorMessage,
    });
  }
};

const changePasswordController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = changePasswordValidator.parse(req.body);

    const userId = req.user?.id;

    if (!userId) {
      console.warn('No user ID in request');
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findById(userId);
    console.log('User fetched from DB:', user ? user.username : null);

    if (!user) {
      console.warn('User not found with id:', userId);
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: 'User not found',
      });
    }

    const isMatch = await comparePasswords(currentPassword, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.warn('Current password incorrect');
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    console.log('Password updated successfully for user:', user.username);
    res.status(StatusCodes.OK).json({
      status: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error in changePasswordController:', error);

    let errorData: { field: string; message: string }[] = [];

    if (error instanceof ZodError) {
      errorData = error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
    } else {
      errorData.push({ field: '', message: extractErrorMessage(error as Error) });
    }

    res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: 'Failed to update password',
      error: errorData,
    });
  }
};

export {
  getUsersController,
  getUserController,
  updateUserController,
  createUserController,
  toggleUserActiveController,
  changeUserRoleController,
  changePasswordController,
  deleteUserController,
};
