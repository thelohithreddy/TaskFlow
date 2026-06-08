import mongoose, { Document, Schema, Types } from 'mongoose';
import { TASK_PRIORITY_VALUES, TaskPriority } from '../constants/taskPriority';
import { TASK_STATUS_VALUES, TaskStatus } from '../constants/taskStatus';

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY_VALUES,
      default: 'medium',
    },
    status: {
      type: String,
      enum: TASK_STATUS_VALUES,
      default: 'pending',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { _id, __v, ...rest } = ret;
        return { ...rest, id: _id };
      },
    },
  }
);

taskSchema.index({ createdBy: 1, isDeleted: 1, createdAt: -1 });
taskSchema.index({ assignedTo: 1, status: 1, isDeleted: 1 });
taskSchema.index({ status: 1, priority: 1, isDeleted: 1 });
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ isDeleted: 1, updatedAt: -1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
