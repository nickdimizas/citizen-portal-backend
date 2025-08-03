import { z } from 'zod';

import { UserRole } from '../models/user.model';

const registerValidator = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters' })
    .max(20, { message: 'Username must be at most 20 characters' }),
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/, {
    message: 'Invalid email format',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/, {
      message:
        'Password must contain at least one letter, one number, and one special character (!@#$%^&*)',
    }),
  firstname: z
    .string()
    .min(2, { message: 'Firstname must be at least 2 characters' })
    .max(50, { message: 'Firstname must be at most 50 characters' }),
  lastname: z
    .string()
    .min(2, { message: 'Lastname must be at least 2 characters' })
    .max(50, { message: 'Lastname must be at most 50 characters' }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
  address: z.object({
    city: z
      .string()
      .min(2, { message: 'City must be at least 2 characters' })
      .max(50, { message: 'City must be at most 50 characters' }),
    street: z.string().max(50, { message: 'Street must be at most 50 characters' }),
    number: z.string().max(10, { message: 'Street number must be at most 10 characters' }),
    postcode: z.string().regex(/^\d{5}$/, { message: 'Postcode must be exactly 5 digits' }),
  }),
  ssn: z.string().regex(/^\d{9}$/, { message: 'SSN must be exactly 9 digits' }),
});

const usernameOrEmailValidator = z.string().refine(
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

const loginValidator = z.object({
  usernameOrEmail: usernameOrEmailValidator,
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/, {
      message:
        'Password must contain at least one letter, one number, and one special character (!@#$%^&*)',
    }),
});

const createUserValidator = registerValidator.extend({
  role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
});

export { registerValidator, loginValidator, createUserValidator };
