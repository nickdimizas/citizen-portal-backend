import jwt, { SignOptions } from 'jsonwebtoken';

import { IUser } from '../models/user.model';
import { findUser } from '../services/user.service';
import { comparePasswords } from '../utils/password';
import { extractErrorMessage } from '../utils/errorHandler';

type JwtExpiresIn =
  | number
  | '1s'
  | '10s'
  | '30s'
  | '1m'
  | '10m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '6h'
  | '12h'
  | '1d'
  | '2d'
  | '7d'
  | '14d'
  | '30d';

type TokenPayload = {
  username: string;
  email: string;
  role: string;
};

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN as JwtExpiresIn;

const login = async (usernameOrEmail: string, password: string): Promise<IUser> => {
  const user = await findUser(usernameOrEmail);

  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordValid = await comparePasswords(password, user?.password || '');

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
};

const generateAccessToken = (user: TokenPayload): string => {
  const payload: TokenPayload = {
    username: user.username,
    email: user.email,
    role: user.role,
  };
  const options: SignOptions = { expiresIn: EXPIRES_IN };
  const token: string = jwt.sign(payload, SECRET, options);
  console.log('Access token generated for:', payload.username);
  return token;
};

const verifyAccessToken = (token: string): { verified: boolean; data: TokenPayload | string } => {
  try {
    const payload = jwt.verify(token, SECRET) as TokenPayload;
    console.log('Token verified successfully:', payload);
    return { verified: true, data: payload };
  } catch (error: unknown) {
    const errorMessage = extractErrorMessage(error);
    console.error('Token verification error:', errorMessage);
    return { verified: false, data: errorMessage };
  }
};

export { login, generateAccessToken, verifyAccessToken };
