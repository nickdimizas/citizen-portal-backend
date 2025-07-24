import mongoose, { Document, Schema } from 'mongoose';

enum UserRole {
  Admin = 'admin',
  Employee = 'employee',
  Citizen = 'citizen',
}

interface Address {
  city: string;
  street: string;
  number: string;
  postcode: string;
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: Address;
  ssn: string;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
  {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [2, 'City must be between 2 and 50 characters'],
      maxlength: [50, 'City must be between 2 and 50 characters'],
    },
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true,
      maxlength: [50, 'Street must be at most 50 characters'],
    },
    number: {
      type: String,
      required: [true, 'Street number is required'],
      trim: true,
      maxlength: [10, 'Street number must be at most 10 characters'],
    },
    postcode: {
      type: String,
      required: [true, 'Postcode is required'],
      trim: true,
      match: [/^\d{5}$/, 'Postcode must be exactly 5 digits'],
    },
  },
  { _id: false },
);

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Username must be between 2 and 20 characters'],
      maxlength: [20, 'Username must be between 2 and 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain at least one letter, one number, and one special character (!@#$%^&*)',
      ],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Citizen,
      required: true,
    },
    firstname: {
      type: String,
      required: [true, 'Firstname is required'],
      trim: true,
      minlength: [2, 'Firstname must be between 2 and 50 characters'],
      maxlength: [50, 'Firstname must be between 2 and 50 characters'],
    },
    lastname: {
      type: String,
      required: [true, 'Lastname is required'],
      trim: true,
      minlength: [2, 'Lastname must be between 2 and 50 characters'],
      maxlength: [50, 'Lastname must be between 2 and 50 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },
    address: {
      type: addressSchema,
      required: [true, 'Address is required'],
    },
    ssn: {
      type: String,
      required: [true, 'Ssn is required'],
      unique: true,
      trim: true,
      match: [/^\d{9}$/, 'SSN must be exactly 9 digits'],
    },
  },
  { collection: 'users', timestamps: true },
);

const User = mongoose.model('User', userSchema);

export { User, IUser, UserRole };
