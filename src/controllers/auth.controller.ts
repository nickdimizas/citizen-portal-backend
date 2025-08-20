import { Request, Response } from 'express';
import { ZodError } from 'zod';

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
    console.log(`User registered successfully: ${userData.username}`);
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: 'User registered successfully', data: userData.username });
  } catch (error) {
    console.error('User registration error:', error);

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
      .json({ status: false, message: 'User registration failed', data: errorData });
  }
};

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginValidator.parse(req.body);

    const user = await login(validatedData.usernameOrEmail, validatedData.password);

    const token = generateAccessToken({
      id: user.id,
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
    console.error('User login error:', error);

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
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: false, message: 'Login failed', data: errorData });
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
