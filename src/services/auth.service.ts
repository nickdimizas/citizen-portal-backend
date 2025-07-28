import { IUser } from '../models/user.model';
import { findUser } from '../services/user.service';
import { comparePasswords } from '../utils/password';

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

export { login };
