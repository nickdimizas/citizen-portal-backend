import { Response } from 'express';

import { AuthenticatedRequest } from '../types/authenticated-request';
import { createUser } from '../services/user.service';
import { StatusCodes } from '../constants/statusCodes';
import { createUserValidator } from '../validators/user.validator';
import { extractErrorMessage } from '../utils/errorHandler';

const createUserByAdminController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = createUserValidator.parse(req.body);
    await createUser(validatedData);
    console.log(`User created successfully: ${validatedData.username} (${validatedData.role})`);
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: 'User created successfully', data: validatedData.username });
  } catch (error) {
    console.error('User creation error:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: 'User creation failed', data: errorMessage });
  }
};

export { createUserByAdminController };
