export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TaskUser {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: TaskUser | string;
  createdBy?: TaskUser | string;
  updatedBy?: TaskUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
}

export interface Analytics {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  recentActivity: Array<{
    action: string;
    userId: string;
    userName: string;
    entityType: string;
    entityId: string;
    createdAt: string;
  }>;
}
