import { User, IUser } from '../models/user.model';

const createUser = async (data: IUser) => {
  await User.create(data);
};

const findUser = async (usernameOrEmail: string): Promise<IUser | null> => {
  return User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
};

export { createUser, findUser };
