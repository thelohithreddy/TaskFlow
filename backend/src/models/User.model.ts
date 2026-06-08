import mongoose, { Document, Schema } from 'mongoose';
import { ROLE_VALUES, Role } from '../constants/roles';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { _id, __v, password, ...rest } = ret;
        return { ...rest, id: _id };
      },
    },
  }
);

userSchema.index({ role: 1, isDeleted: 1 });
userSchema.index({ isDeleted: 1, createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
