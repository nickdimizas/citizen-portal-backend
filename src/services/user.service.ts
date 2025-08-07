import { z } from 'zod';
import { FilterQuery } from 'mongoose';

import { User, IUser } from '../models/user.model';
import { createUserValidator } from '../validators/user.validator';
import { GetUsersOptions, UserPaginationResult } from '../types/user';

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

const getUsers = async (options: GetUsersOptions): Promise<UserPaginationResult> => {
  const {
    roleFilter,
    active,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = options;

  const query: FilterQuery<IUser> = {};

  if (roleFilter?.length) {
    query.role = { $in: roleFilter };
  }

  if (typeof active === 'boolean') {
    query.active = active;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { username: searchRegex },
      { firstname: searchRegex },
      { lastname: searchRegex },
      { email: searchRegex },
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .select('-password -__v -ssn');

  const total = await User.countDocuments(query);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export { createUser, findUserByUsernameOrEmail, findUserByAnyUniqueField, getUsers };
