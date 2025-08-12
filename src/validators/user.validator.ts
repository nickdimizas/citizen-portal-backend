import { z } from 'zod';

import { UserRole } from '../models/user.model';

type CreateUserInput = z.infer<typeof createUserValidator>;
type ChangePasswordInput = z.infer<typeof changePasswordValidator>;
type UpdateUserInput = z.infer<typeof updateUserValidator>;

const registerValidator = z
  .object({
    username: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 2, { message: 'Username must be at least 2 characters' })
      .refine((val) => val.length <= 20, { message: 'Username must be at most 20 characters' }),
    email: z
      .string()
      .transform((str) => str.trim())
      .refine(
        (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/.test(val),
        { message: 'Please enter a valid email address in the format name@example.com' },
      ),
    password: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 8, { message: 'Password must be at least 8 characters' })
      .refine((val) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(val), {
        message:
          'Password must contain at least one letter, one number, and one special character (!@#$%^&*)',
      }),
    firstname: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 2, { message: 'Firstname must be at least 2 characters' })
      .refine((val) => val.length <= 50, { message: 'Firstname must be at most 50 characters' }),
    lastname: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 2, { message: 'Lastname must be at least 2 characters' })
      .refine((val) => val.length <= 50, { message: 'Lastname must be at most 50 characters' }),
    phoneNumber: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => /^\d{10}$/.test(val), { message: 'Phone number must be exactly 10 digits' }),
    address: z.object({
      city: z
        .string()
        .transform((str) => str.trim())
        .refine((val) => val.length >= 2, { message: 'City must be at least 2 characters' })
        .refine((val) => val.length <= 50, { message: 'City must be at most 50 characters' }),
      street: z
        .string()
        .nonempty({ message: 'Street cannot be empty' })
        .transform((str) => str.trim())
        .refine((val) => val.length <= 50, { message: 'Street must be at most 50 characters' }),
      number: z
        .string()
        .nonempty({ message: 'Street number cannot be empty' })
        .refine((val) => val.length <= 10, {
          message: 'Street number must be at most 10 characters',
        }),
      postcode: z
        .string()
        .transform((str) => str.trim())
        .refine((val) => /^\d{5}$/.test(val), { message: 'Postcode must be exactly 5 digits' }),
    }),

    ssn: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => /^\d{9}$/.test(val), { message: 'SSN must be exactly 9 digits' }),
  })
  .strict();

const usernameOrEmailValidator = z
  .string()
  .transform((str) => str.trim())
  .refine(
    (val) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;
      const usernameMinLength = 2;
      const usernameMaxLength = 20;

      return (
        emailRegex.test(val) || (val.length >= usernameMinLength && val.length <= usernameMaxLength)
      );
    },
    {
      message:
        'Must be a valid email(e.g. name@example.com) or a username between 2 and 20 characters',
    },
  );

const loginValidator = z
  .object({
    usernameOrEmail: usernameOrEmailValidator,
    password: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 8, { message: 'Password must be at least 8 characters' })
      .refine((val) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(val), {
        message:
          'Password must contain at least one letter, one number, and one special character (!@#$%^&*)',
      }),
  })
  .strict();

const createUserValidator = registerValidator
  .extend({
    role: z.nativeEnum(UserRole),
  })
  .strict();

const getUsersQueryValidator = z.object({
  roleFilter: z
    .string()
    .optional()
    .transform((val) => val?.trim())
    .transform((val) => (val ? val.split(',').map((role) => role.trim()) : undefined))
    .transform((roles) => {
      if (!roles) return undefined;
      const validRoles = Object.values(UserRole);
      return roles.filter((role) => validRoles.includes(role as UserRole)) as UserRole[];
    }),
  active: z
    .string()
    .optional()
    .transform((val) => {
      if (val?.trim() === 'true') return true;
      if (val?.trim() === 'false') return false;
      return undefined;
    }),
  sortBy: z
    .string()
    .optional()
    .transform((val) => val?.trim() || 'createdAt'),
  sortOrder: z
    .string()
    .optional()
    .transform((val) => (val?.trim().toLowerCase() === 'desc' ? 'desc' : 'asc')),
  page: z
    .string()
    .optional()
    .transform((val) => {
      const trimmed = val?.trim();
      const parsed = Number(trimmed);
      return !isNaN(parsed) && parsed > 0 ? parsed : 1;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const trimmed = val?.trim();
      const parsed = Number(trimmed);
      return !isNaN(parsed) && parsed > 0 ? parsed : 10;
    }),
  search: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

const updateUserValidator = z
  .object({
    username: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 2, { message: 'Username must be at least 2 characters' })
      .refine((val) => val.length <= 20, { message: 'Username must be at most 20 characters' })
      .optional(),
    email: z
      .string()
      .transform((str) => str.trim())
      .refine(
        (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/.test(val),
        { message: 'Please enter a valid email address in the format name@example.com' },
      )
      .optional(),
    firstname: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 2, { message: 'Firstname must be at least 2 characters' })
      .refine((val) => val.length <= 50, { message: 'Firstname must be at most 50 characters' })
      .optional(),
    lastname: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => val.length >= 2, { message: 'Lastname must be at least 2 characters' })
      .refine((val) => val.length <= 50, { message: 'Lastname must be at most 50 characters' })
      .optional(),
    phoneNumber: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => /^\d{10}$/.test(val), { message: 'Phone number must be exactly 10 digits' })
      .optional(),
    address: z
      .object({
        city: z
          .string()
          .transform((str) => str.trim())
          .refine((val) => val.length >= 2, { message: 'City must be at least 2 characters' })
          .refine((val) => val.length <= 50, { message: 'City must be at most 50 characters' })
          .optional(),
        street: z
          .string()
          .nonempty({ message: 'Street cannot be empty' })
          .transform((str) => str.trim())
          .refine((val) => val.length <= 50, { message: 'Street must be at most 50 characters' })
          .optional(),
        number: z
          .string()
          .nonempty({ message: 'Street number cannot be empty' })
          .refine((val) => val.length <= 10, {
            message: 'Street number must be at most 10 characters',
          })
          .optional(),
        postcode: z
          .string()
          .transform((str) => str.trim())
          .refine((val) => /^\d{5}$/.test(val), { message: 'Postcode must be exactly 5 digits' })
          .optional(),
      })
      .optional(),
    ssn: z
      .string()
      .transform((str) => str.trim())
      .refine((val) => /^\d{9}$/.test(val), { message: 'SSN must be exactly 9 digits' })
      .optional(),
  })
  .strict();

const changePasswordValidator = z
  .object({
    newPassword: z
      .string()
      .nonempty({ message: 'New password is required' })
      .transform((str) => str.trim())
      .refine((val) => val.length >= 8, { message: 'Password must be at least 8 characters' })
      .refine((val) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(val), {
        message:
          'Password must contain at least one letter, one number, and one special character (!@#$%^&*)',
      }),
    currentPassword: z
      .string()
      .nonempty({ message: 'Current password is required' })
      .transform((str) => str.trim())
      .refine((val) => val.length >= 8, {
        message: 'Current password must be at least 8 characters',
      }),
  })
  .strict();

export type { ChangePasswordInput, CreateUserInput, UpdateUserInput };
export {
  registerValidator,
  loginValidator,
  createUserValidator,
  getUsersQueryValidator,
  changePasswordValidator,
  updateUserValidator,
};
