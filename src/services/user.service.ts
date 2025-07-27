import { User, IUser } from '../models/user.model';

const createUser = async (data: IUser) => {
  await User.create(data);
};

export { createUser };
