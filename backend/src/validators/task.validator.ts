import { body, query } from 'express-validator';
import { TASK_PRIORITY_VALUES } from '../constants/taskPriority';
import { TASK_STATUS_VALUES } from '../constants/taskStatus';
import { paginationQuery } from './common.validator';

export const createTaskValidator = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  body('priority').optional().isIn(TASK_PRIORITY_VALUES).withMessage('Invalid priority'),
  body('status').optional().isIn(TASK_STATUS_VALUES).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid assignedTo user ID'),
];

export const updateTaskValidator = [
  body('title').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  body('priority').optional().isIn(TASK_PRIORITY_VALUES).withMessage('Invalid priority'),
  body('status').optional().isIn(TASK_STATUS_VALUES).withMessage('Invalid status'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
  body('assignedTo').optional({ nullable: true }).isMongoId().withMessage('Invalid assignedTo user ID'),
];

export const taskQueryValidator = [
  ...paginationQuery,
  query('status').optional().isIn(TASK_STATUS_VALUES).withMessage('Invalid status filter'),
  query('priority').optional().isIn(TASK_PRIORITY_VALUES).withMessage('Invalid priority filter'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search query too long'),
  query('assignedTo').optional().isMongoId().withMessage('Invalid assignedTo filter'),
];
