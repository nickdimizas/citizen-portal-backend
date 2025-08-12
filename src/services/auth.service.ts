import jwt, { SignOptions } from 'jsonwebtoken';

import { IUser } from '../models/user.model';
import { getUserByUsernameOrEmail } from '../services/user.service';
import { comparePasswords } from '../utils/password';
import { extractErrorMessage } from '../utils/errorHandler';
import { TokenPayload, JwtExpiresIn } from '../types/index';

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN as JwtExpiresIn;

type TokenVerificationSuccess = {
  verified: true;
  data: TokenPayload;
};

type TokenVerificationFailure = {
  verified: false;
  data: string;
};

export type TokenVerificationResult = TokenVerificationSuccess | TokenVerificationFailure;

const login = async (usernameOrEmail: string, password: string): Promise<IUser> => {
  const user = await getUserByUsernameOrEmail(usernameOrEmail);

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.active) {
    throw new Error('User account is inactive');
  }

  const isPasswordValid = await comparePasswords(password, user?.password || '');

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
};

const generateAccessToken = (user: TokenPayload): string => {
  const payload: TokenPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  const options: SignOptions = { expiresIn: EXPIRES_IN };
  const token: string = jwt.sign(payload, SECRET, options);
  return token;
};

const verifyAccessToken = (token: string): TokenVerificationResult => {
  try {
    const payload = jwt.verify(token, SECRET) as TokenPayload;
    return { verified: true, data: payload };
  } catch (error) {
    const errorMessage = extractErrorMessage(error as Error);
    console.warn('Token verification failed:', errorMessage);
    return { verified: false, data: errorMessage };
  }
};

export { login, generateAccessToken, verifyAccessToken };
