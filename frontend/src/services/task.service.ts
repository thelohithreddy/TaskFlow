import { api } from './api';
import { ApiResponse, PaginatedData } from '../types/api.types';
import { CreateTaskData, Task, TaskFilters } from '../types/task.types';

export const taskService = {
  getTasks: async (filters: TaskFilters = {}) => {
    const res = await api.get<ApiResponse<PaginatedData<Task>>>('/tasks', { params: filters });
    return res.data.data!;
  },

  getTask: async (id: string) => {
    const res = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
    return res.data.data!.task;
  },

  createTask: async (data: CreateTaskData) => {
    const res = await api.post<ApiResponse<{ task: Task }>>('/tasks', data);
    return res.data.data!.task;
  },

  updateTask: async (id: string, data: Partial<CreateTaskData>) => {
    const res = await api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data);
    return res.data.data!.task;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};
