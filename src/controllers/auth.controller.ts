import { Request, Response } from 'express';

import { createUser } from '../services/user.service';
import { UserRole } from '../models/user.model';
import { extractErrorMessage } from '../utils/errorHandler';
import { StatusCodes } from '../constants/statusCodes';
import { login, generateAccessToken } from '../services/auth.service';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = { ...req.body, role: UserRole.Citizen };
    await createUser(userData);
    console.log('User created successfully:', userData.username);
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: 'User registered successfully', data: userData.username });
  } catch (error: unknown) {
    console.error('Registration error', error);
    const errorMessage = extractErrorMessage(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: 'User registration failed', data: errorMessage });
  }
};

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await login(usernameOrEmail, password);
    const token = generateAccessToken({
      username: user.username,
      email: user.email,
      role: user.role,
    });

    console.log(`User logged in successfully: ${user.username}`);

    res.status(StatusCodes.OK).json({ status: true, message: 'Login successful', data: { token } });
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = extractErrorMessage(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: false, message: 'Login failed', data: errorMessage });
  }
};

export { register, loginController };
