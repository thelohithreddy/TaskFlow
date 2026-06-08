import { ROLES } from '../constants/roles';
import { AUDIT_ACTIONS } from '../constants/auditActions';
import { HTTP_STATUS } from '../constants/httpStatus';
import { taskRepository } from '../repositories/Task.repository';
import { userRepository } from '../repositories/User.repository';
import { auditService } from './Audit.service';
import { ApiError } from '../utils/ApiError';
import {
  buildPaginationMeta,
  parsePagination,
} from '../utils/pagination.util';
import { PaginationQuery } from '../types/api.types';
import { TaskPriority } from '../constants/taskPriority';
import { TaskStatus } from '../constants/taskStatus';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
  assignedTo?: string | null;
}

interface TaskQuery extends PaginationQuery {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
}

export class TaskService {
  private async assertTaskAccess(
    taskId: string,
    userId: string,
    role: string
  ) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
    }

    const isOwner = task.createdBy?.toString() === userId;
    const isAssigned = task.assignedTo?.toString() === userId;
    const isAdmin = role === ROLES.ADMIN;

    if (!isOwner && !isAssigned && !isAdmin) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Access denied to this task');
    }

    return task;
  }

  async createTask(userId: string, data: CreateTaskInput, meta?: RequestMeta) {
    if (data.assignedTo) {
      const assignee = await userRepository.findById(data.assignedTo);
      if (!assignee) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Assigned user not found');
      }
    }

    const task = await taskRepository.create({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      assignedTo: data.assignedTo || userId,
      createdBy: userId,
    });

    await auditService.log({
      userId,
      action: AUDIT_ACTIONS.TASK_CREATE,
      entityType: 'Task',
      entityId: task.id,
      metadata: { title: task.title },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return taskRepository.findById(task.id);
  }

  async getTasks(userId: string, role: string, query: TaskQuery) {
    const pagination = parsePagination(query);
    const isAdmin = role === ROLES.ADMIN;

    const { tasks, total } = await taskRepository.findAll(
      {
        status: query.status,
        priority: query.priority,
        assignedTo: query.assignedTo,
        search: query.search,
        userId,
        isAdmin,
      },
      pagination
    );

    return {
      items: tasks,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getTaskById(taskId: string, userId: string, role: string) {
    return this.assertTaskAccess(taskId, userId, role);
  }

  async updateTask(
    taskId: string,
    userId: string,
    role: string,
    data: UpdateTaskInput,
    meta?: RequestMeta
  ) {
    await this.assertTaskAccess(taskId, userId, role);

    if (data.assignedTo) {
      const assignee = await userRepository.findById(data.assignedTo);
      if (!assignee) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Assigned user not found');
      }
    }

    const updateData = {
      ...data,
      dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
      updatedBy: userId,
    };

    const task = await taskRepository.update(taskId, updateData);
    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
    }

    await auditService.log({
      userId,
      action: AUDIT_ACTIONS.TASK_UPDATE,
      entityType: 'Task',
      entityId: taskId,
      metadata: { changes: data },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return task;
  }

  async deleteTask(taskId: string, userId: string, role: string, meta?: RequestMeta) {
    const task = await this.assertTaskAccess(taskId, userId, role);
    await taskRepository.softDelete(taskId, userId);

    await auditService.log({
      userId,
      action: AUDIT_ACTIONS.TASK_DELETE,
      entityType: 'Task',
      entityId: taskId,
      metadata: { title: task.title },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }
}

export const taskService = new TaskService();
