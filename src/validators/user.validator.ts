import { z } from 'zod';

import { UserRole } from '../models/user.model';

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
        { message: 'Invalid email format' },
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
        .transform((str) => str.trim())
        .refine((val) => val.length <= 50, { message: 'Street must be at most 50 characters' }),
      number: z.string().refine((val) => val.length <= 10, {
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
      message: 'Must be a valid email or a username between 2 and 20 characters',
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
    role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
  })
  .strict();

export { registerValidator, loginValidator, createUserValidator };
