import { z } from 'zod';

import { User, IUser } from '../models/user.model';
import { createUserValidator } from '../validators/user.validator';

type CreateUserInput = z.infer<typeof createUserValidator>;

const createUser = async (data: CreateUserInput) => {
  const { username, email, ssn } = data;
  const existingUser = await findUserByAnyUniqueField(username, email, ssn);

  if (existingUser) {
    if (!existingUser.active) {
      throw new Error(
        'An account with this email, username, or SSN exists but is currently inactive. Please contact support.',
      );
    }

    throw new Error('User with provided username, email, or SSN already exists');
  }

  await User.create(data);
};

const findUserByUsernameOrEmail = async (usernameOrEmail: string): Promise<IUser | null> => {
  return User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
};

const findUserByAnyUniqueField = async (
  username?: string,
  email?: string,
  ssn?: string,
): Promise<IUser | null> => {
  const conditions = [];
  if (username) conditions.push({ username });
  if (email) conditions.push({ email });
  if (ssn) conditions.push({ ssn });

  if (conditions.length === 0) return null;

  return User.findOne({ $or: conditions });
};

export { createUser, findUserByUsernameOrEmail, findUserByAnyUniqueField };
