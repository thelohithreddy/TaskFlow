import { AUDIT_ACTIONS } from '../constants/auditActions';
import { HTTP_STATUS } from '../constants/httpStatus';
import { userRepository } from '../repositories/User.repository';
import { auditService } from './Audit.service';
import { hashPassword, comparePassword } from '../utils/password.util';
import { ApiError } from '../utils/ApiError';
import { SafeUser } from '../types/auth.types';
import { IUser } from '../models/User.model';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

const toSafeUser = (user: IUser): SafeUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return toSafeUser(user);
  }

  async updateProfile(
    userId: string,
    data: { name?: string; email?: string },
    meta?: RequestMeta
  ) {
    if (data.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'Email already in use');
      }
    }

    const user = await userRepository.update(userId, data);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    await auditService.log({
      userId,
      action: AUDIT_ACTIONS.PROFILE_UPDATE,
      entityType: 'User',
      entityId: userId,
      metadata: { changes: data },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return toSafeUser(user);
  }

  async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string },
    meta?: RequestMeta
  ) {
    const user = await userRepository.findByEmail(
      (await userRepository.findById(userId))?.email || '',
      true
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    const isMatch = await comparePassword(data.currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Current password is incorrect');
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await userRepository.update(userId, { password: hashedPassword });

    await auditService.log({
      userId,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      entityType: 'User',
      entityId: userId,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }
}

export const userService = new UserService();
