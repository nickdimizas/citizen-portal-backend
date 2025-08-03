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
    const trimmedBody = {
      username: req.body.username.trim(),
      email: req.body.email.trim(),
      password: req.body.password.trim(),
      role: req.body.role.trim(),
      firstname: req.body.firstname.trim(),
      lastname: req.body.lastname.trim(),
      phoneNumber: req.body.phoneNumber.trim(),
      address: {
        city: req.body.address.city.trim(),
        street: req.body.address.street.trim(),
        number: req.body.address.number.trim(),
        postcode: req.body.address.postcode.trim(),
      },
      ssn: req.body.ssn.trim(),
    };

    const validatedData = createUserValidator.parse(trimmedBody);
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
