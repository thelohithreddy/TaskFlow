import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.model';
import { Task } from '../models/Task.model';
import { hashPassword } from '../utils/password.util';
import { ROLES } from '../constants/roles';
import { TASK_PRIORITY } from '../constants/taskPriority';
import { TASK_STATUS } from '../constants/taskStatus';

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Task.deleteMany({});

  const adminPassword = await hashPassword('Admin@123456');
  const userPassword = await hashPassword('User@123456');

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@taskflow.pro',
    password: adminPassword,
    role: ROLES.ADMIN,
  });

  const user = await User.create({
    name: 'Demo User',
    email: 'user@taskflow.pro',
    password: userPassword,
    role: ROLES.USER,
  });

  const tasks = [
    {
      title: 'Setup CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      priority: TASK_PRIORITY.HIGH,
      status: TASK_STATUS.IN_PROGRESS,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedTo: user._id,
      createdBy: admin._id,
    },
    {
      title: 'Design Dashboard UI',
      description: 'Create wireframes and implement responsive dashboard',
      priority: TASK_PRIORITY.MEDIUM,
      status: TASK_STATUS.PENDING,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      assignedTo: user._id,
      createdBy: user._id,
    },
    {
      title: 'Write API Documentation',
      description: 'Complete Swagger docs for all endpoints',
      priority: TASK_PRIORITY.LOW,
      status: TASK_STATUS.COMPLETED,
      assignedTo: admin._id,
      createdBy: admin._id,
    },
    {
      title: 'Security Audit',
      description: 'Review authentication flow and rate limiting',
      priority: TASK_PRIORITY.CRITICAL,
      status: TASK_STATUS.PENDING,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assignedTo: admin._id,
      createdBy: admin._id,
    },
  ];

  await Task.insertMany(tasks);

  console.log('Seed completed:');
  console.log('  Admin: admin@taskflow.pro / Admin@123456');
  console.log('  User:  user@taskflow.pro / User@123456');

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
