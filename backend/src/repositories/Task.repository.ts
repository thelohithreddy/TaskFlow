import { FilterQuery } from 'mongoose';
import { Task, ITask } from '../models/Task.model';
import {
  CreateTaskData,
  ITaskRepository,
  TaskFilter,
  UpdateTaskData,
} from './interfaces/ITaskRepository';
import { ParsedPagination } from '../utils/pagination.util';

export class TaskRepository implements ITaskRepository {
  private buildFilter(filter: TaskFilter): FilterQuery<ITask> {
    const query: FilterQuery<ITask> = { isDeleted: false };

    if (filter.status) query.status = filter.status;
    if (filter.priority) query.priority = filter.priority;
    if (filter.assignedTo) query.assignedTo = filter.assignedTo;

    if (!filter.isAdmin && filter.userId) {
      query.$or = [{ createdBy: filter.userId }, { assignedTo: filter.userId }];
    }

    if (filter.createdBy) query.createdBy = filter.createdBy;

    if (filter.search) {
      query.$text = { $search: filter.search };
    }

    return query;
  }

  async create(data: CreateTaskData) {
    return Task.create(data);
  }

  async findById(id: string) {
    return Task.findOne({ _id: id, isDeleted: false })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('updatedBy', 'name email');
  }

  async findAll(filter: TaskFilter, pagination: ParsedPagination) {
    const query = this.buildFilter(filter);
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort(pagination.sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email'),
      Task.countDocuments(query),
    ]);
    return { tasks, total };
  }

  async update(id: string, data: UpdateTaskData) {
    return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('updatedBy', 'name email');
  }

  async softDelete(id: string, updatedBy: string) {
    return Task.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), updatedBy },
      { new: true }
    );
  }

  async count(filter: Record<string, unknown> = {}) {
    return Task.countDocuments({ isDeleted: false, ...filter });
  }

  async aggregateStats() {
    const [stats] = await Task.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          pending: {
            $sum: {
              $cond: [{ $in: ['$status', ['pending', 'in_progress']] }, 1, 0],
            },
          },
          highPriority: {
            $sum: {
              $cond: [{ $in: ['$priority', ['high', 'critical']] }, 1, 0],
            },
          },
        },
      },
    ]);

    return stats || { total: 0, completed: 0, pending: 0, highPriority: 0 };
  }
}

export const taskRepository = new TaskRepository();
