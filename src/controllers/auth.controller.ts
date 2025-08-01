import { Request, Response } from 'express';

import { createUser } from '../services/user.service';
import { UserRole } from '../models/user.model';
import { extractErrorMessage } from '../utils/errorHandler';
import { StatusCodes } from '../constants/statusCodes';
import { login, generateAccessToken } from '../services/auth.service';
import { registerValidator, loginValidator } from '../validators/user.validator';

const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const trimmedBody = {
      username: req.body.username.trim(),
      email: req.body.email.trim(),
      password: req.body.password.trim(),
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

    const validatedData = registerValidator.parse(trimmedBody);
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
    const trimmedBody = {
      usernameOrEmail:
        typeof req.body.usernameOrEmail === 'string' ? req.body.usernameOrEmail.trim() : '',
      password: typeof req.body.password === 'string' ? req.body.password.trim() : '',
    };

    const validatedData = loginValidator.parse(trimmedBody);

    const user = await login(validatedData.usernameOrEmail, validatedData.password);
    const token = generateAccessToken({
      username: user.username,
      email: user.email,
      role: user.role,
    });

    console.log(`User logged in successfully: ${user.username}`);

    res.status(StatusCodes.OK).json({ status: true, message: 'Login successful', data: { token } });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = extractErrorMessage(error as Error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: false, message: 'Login failed', data: errorMessage });
  }
};

export { registerController, loginController };
