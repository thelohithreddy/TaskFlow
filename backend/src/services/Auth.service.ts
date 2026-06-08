import { ROLES } from '../constants/roles';
import { AUDIT_ACTIONS } from '../constants/auditActions';
import { HTTP_STATUS } from '../constants/httpStatus';
import { userRepository } from '../repositories/User.repository';
import { refreshTokenRepository } from '../repositories/RefreshToken.repository';
import { auditService } from './Audit.service';
import { tokenService } from './Token.service';
import { hashPassword, comparePassword } from '../utils/password.util';
import { ApiError } from '../utils/ApiError';
import { SafeUser } from '../types/auth.types';
import { IUser } from '../models/User.model';

interface AuthMeta {
  userAgent?: string;
  ipAddress?: string;
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

export class AuthService {
  async register(
    data: { name: string; email: string; password: string; role?: string },
    meta?: AuthMeta
  ) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Email already registered');
    }

    const role = data.role === ROLES.ADMIN && process.env.NODE_ENV !== 'production'
      ? ROLES.ADMIN
      : ROLES.USER;

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
    });

    const tokens = await tokenService.generateTokenPair(user.id, user.email, user.role, meta);

    await auditService.log({
      userId: user.id,
      action: AUDIT_ACTIONS.USER_REGISTER,
      entityType: 'User',
      entityId: user.id,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return { user: toSafeUser(user), tokens };
  }

  async login(email: string, password: string, meta?: AuthMeta) {
    const user = await userRepository.findByEmail(email, true);
    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    await userRepository.update(user.id, { lastLoginAt: new Date() });

    const tokens = await tokenService.generateTokenPair(user.id, user.email, user.role, meta);

    await auditService.log({
      userId: user.id,
      action: AUDIT_ACTIONS.USER_LOGIN,
      entityType: 'User',
      entityId: user.id,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return { user: toSafeUser(user), tokens };
  }

  async refresh(refreshToken: string, meta?: AuthMeta) {
    return tokenService.rotateRefreshToken(refreshToken, meta);
  }

  async logout(userId: string, refreshToken?: string, meta?: AuthMeta) {
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    } else {
      await refreshTokenRepository.revokeAllForUser(userId);
    }

    await auditService.log({
      userId,
      action: AUDIT_ACTIONS.USER_LOGOUT,
      entityType: 'User',
      entityId: userId,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return toSafeUser(user);
  }
}

export const authService = new AuthService();
