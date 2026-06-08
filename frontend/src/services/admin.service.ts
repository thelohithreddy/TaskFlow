import { api } from './api';
import { ApiResponse, PaginatedData } from '../types/api.types';
import { Analytics, Task } from '../types/task.types';
import { User } from '../types/user.types';

export const adminService = {
  getUsers: async (page = 1, limit = 10) => {
    const res = await api.get<ApiResponse<PaginatedData<User>>>('/admin/users', {
      params: { page, limit },
    });
    return res.data.data!;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },

  getTasks: async (page = 1, limit = 10) => {
    const res = await api.get<ApiResponse<PaginatedData<Task>>>('/admin/tasks', {
      params: { page, limit },
    });
    return res.data.data!;
  },

  getAnalytics: async () => {
    const res = await api.get<ApiResponse<Analytics>>('/admin/analytics');
    return res.data.data!;
  },
};
