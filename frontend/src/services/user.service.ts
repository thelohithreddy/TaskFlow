import { api } from './api';
import { ApiResponse } from '../types/api.types';
import { User } from '../types/user.types';

export const userService = {
  getProfile: async () => {
    const res = await api.get<ApiResponse<{ user: User }>>('/users/profile');
    return res.data.data!.user;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const res = await api.patch<ApiResponse<{ user: User }>>('/users/profile', data);
    return res.data.data!.user;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    await api.patch('/users/change-password', data);
  },
};
