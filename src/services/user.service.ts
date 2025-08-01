import { z } from 'zod';

import { User, IUser } from '../models/user.model';
import { createUserValidator } from '../validators/user.validator';

type CreateUserInput = z.infer<typeof createUserValidator>;

const createUser = async (data: CreateUserInput) => {
  await User.create(data);
};

const findUser = async (usernameOrEmail: string): Promise<IUser | null> => {
  return User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
};

export { createUser, findUser };
