import { FilterQuery } from 'mongoose';

import { User, IUser } from '../models/user.model';
import { CreateUserInput, UpdateUserInput } from '../validators/user.validator';
import { GetUsersOptions, UserPaginationResult } from '../types/user';

const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id).select('-password -__v');
};

const getUserByUsernameOrEmail = async (usernameOrEmail: string): Promise<IUser | null> => {
  return User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
};

const getUserByAnyUniqueField = async (
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

const createUser = async (data: CreateUserInput) => {
  const { username, email, ssn } = data;
  const existingUser = await getUserByAnyUniqueField(username, email, ssn);

  if (existingUser) {
    if (!existingUser.active) {
      console.warn('An account with this email, username, or SSN exists but is currently inactive');
      throw new Error(
        'An account with this email, username, or SSN exists but is currently inactive. Please contact support.',
      );
    }

    console.warn('User with provided username, email, or SSN already exists');
    throw new Error('User with provided username, email, or SSN already exists');
  }

  await User.create(data);
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

const updateUser = async (userId: string, data: UpdateUserInput): Promise<UpdateUserInput> => {
  if (data.username || data.email || data.ssn) {
    const existingUser = await getUserByAnyUniqueField(data.username, data.email, data.ssn);

    if (existingUser && existingUser.id !== userId) {
      if (existingUser.username === data.username) {
        console.warn('Username already exists');
        throw new Error('Username already exists');
      }
      if (existingUser.email === data.email) {
        console.warn('Email already exists');
        throw new Error('Email already exists');
      }
      if (existingUser.ssn === data.ssn) {
        console.warn('SSN already exists');
        throw new Error('SSN already exists');
      }
    }
  }

  const user = await User.findById(userId);
  if (!user) {
    console.warn(`User not found for id ${userId}`);
    throw new Error('User not found');
  }

  Object.assign(user, data);
  await user.save();

  return data;
};

export {
  createUser,
  getUserByUsernameOrEmail,
  getUserByAnyUniqueField,
  getUsers,
  getUserById,
  updateUser,
};
