import { api } from './api';
import { ApiResponse } from '../types/api.types';
import { AuthTokens, LoginCredentials, RegisterData, User } from '../types/user.types';

export const authService = {
  register: async (data: RegisterData) => {
    const res = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', data);
    return res.data.data!;
  },

  login: async (credentials: LoginCredentials) => {
    const res = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', credentials);
    return res.data.data!;
  },

  logout: async (refreshToken?: string) => {
    await api.post('/auth/logout', { refreshToken });
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data!.user;
  },
};
