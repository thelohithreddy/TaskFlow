import { ITask } from '../../models/Task.model';
import { TaskPriority } from '../../constants/taskPriority';
import { TaskStatus } from '../../constants/taskStatus';
import { ParsedPagination } from '../../utils/pagination.util';

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  assignedTo?: string;
  createdBy: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
  assignedTo?: string | null;
  updatedBy: string;
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  search?: string;
  createdBy?: string;
  userId?: string;
  isAdmin?: boolean;
}

export interface ITaskRepository {
  create(data: CreateTaskData): Promise<ITask>;
  findById(id: string): Promise<ITask | null>;
  findAll(
    filter: TaskFilter,
    pagination: ParsedPagination
  ): Promise<{ tasks: ITask[]; total: number }>;
  update(id: string, data: UpdateTaskData): Promise<ITask | null>;
  softDelete(id: string, updatedBy: string): Promise<ITask | null>;
  count(filter?: Record<string, unknown>): Promise<number>;
  aggregateStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  }>;
}
