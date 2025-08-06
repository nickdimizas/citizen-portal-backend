import { Request, Response } from 'express';

import { createUser } from '../services/user.service';
import { UserRole } from '../models/user.model';
import { extractErrorMessage } from '../utils/errorHandler';
import { StatusCodes } from '../constants/statusCodes';
import { login, generateAccessToken } from '../services/auth.service';
import { registerValidator, loginValidator } from '../validators/user.validator';

const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerValidator.parse(req.body);

    const userData = { ...validatedData, role: UserRole.Citizen };
    await createUser(userData);
    console.log('User created successfully:', userData.username);
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: 'User registered successfully', data: userData.username });
  } catch (error) {
    console.error('Registration error', error);
    const errorMessage = extractErrorMessage(error as Error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: false, message: 'User registration failed', data: errorMessage });
  }
};

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginValidator.parse(req.body);

    const user = await login(validatedData.usernameOrEmail, validatedData.password);

    const token = generateAccessToken({
      username: user.username,
      email: user.email,
      role: user.role,
    });

    console.log(`User logged in successfully: ${user.username}`);

    res
      .cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // use HTTPS in production
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      })
      .status(StatusCodes.OK)
      .json({ status: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: false, message: 'Login failed', data: errorMessage });
  }
};

const logoutController = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
};

export { registerController, loginController, logoutController };
