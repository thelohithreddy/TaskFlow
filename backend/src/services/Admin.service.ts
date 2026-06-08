import { AUDIT_ACTIONS } from '../constants/auditActions';
import { HTTP_STATUS } from '../constants/httpStatus';
import { userRepository } from '../repositories/User.repository';
import { taskRepository } from '../repositories/Task.repository';
import { auditService } from './Audit.service';
import { ApiError } from '../utils/ApiError';
import {
  buildPaginationMeta,
  parsePagination,
} from '../utils/pagination.util';
import { PaginationQuery } from '../types/api.types';
import { TaskStatus } from '../constants/taskStatus';
import { TaskPriority } from '../constants/taskPriority';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

interface AdminTaskQuery extends PaginationQuery {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export class AdminService {
  async getAllUsers(query: PaginationQuery) {
    const pagination = parsePagination(query);
    const { users, total } = await userRepository.findAll(pagination);
    return {
      items: users,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async deleteUser(adminId: string, userId: string, meta?: RequestMeta) {
    if (adminId === userId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete your own account');
    }

    const user = await userRepository.softDelete(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    await auditService.log({
      userId: adminId,
      action: AUDIT_ACTIONS.USER_DELETE,
      entityType: 'User',
      entityId: userId,
      metadata: { deletedUserEmail: user.email },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return user;
  }

  async getAllTasks(query: AdminTaskQuery) {
    const pagination = parsePagination(query);
    const { tasks, total } = await taskRepository.findAll(
      {
        status: query.status,
        priority: query.priority,
        search: query.search,
        isAdmin: true,
      },
      pagination
    );
    return {
      items: tasks,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getAnalytics() {
    const [totalUsers, taskStats, recentActivity] = await Promise.all([
      userRepository.count(),
      taskRepository.aggregateStats(),
      auditService.getRecentActivity(10),
    ]);

    return {
      totalUsers,
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
      pendingTasks: taskStats.pending,
      highPriorityTasks: taskStats.highPriority,
      recentActivity: recentActivity.map((log) => ({
        action: log.action,
        userId: log.userId,
        userName: (log.userId as { name?: string })?.name || 'Unknown',
        entityType: log.entityType,
        entityId: log.entityId,
        createdAt: log.createdAt,
      })),
    };
  }
}

export const adminService = new AdminService();
