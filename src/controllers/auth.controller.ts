import { Request, Response } from 'express';

import { createUser } from '../services/user.service';
import { UserRole } from '../models/user.model';
import { extractErrorMessage } from '../utils/errorHandler';
import { StatusCodes } from '../constants/statusCodes';

const register = async (req: Request, res: Response) => {
  try {
    const userData = { ...req.body, role: UserRole.Citizen };
    await createUser(userData);
    console.log('User created successfully:', userData.username);
    res.status(StatusCodes.CREATED).json({ status: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error', error);
    const errorMessage = extractErrorMessage(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: 'User registration failed', data: errorMessage });
  }
};

export { register };
