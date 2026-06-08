import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../constants/roles';
import { AuthTokens, TokenPayload } from '../types/auth.types';
import { generateRefreshToken, hashToken } from '../utils/tokenHash.util';
import { refreshTokenRepository } from '../repositories/RefreshToken.repository';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants/httpStatus';

const ACCESS_EXPIRES_SECONDS = 15 * 60;

export class TokenService {
  generateAccessToken(userId: string, email: string, role: Role): string {
    const payload: TokenPayload = {
      sub: userId,
      email,
      role,
      type: 'access',
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
      if (payload.type !== 'access') {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token type');
      }
      return payload;
    } catch {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired access token');
    }
  }

  async generateTokenPair(
    userId: string,
    email: string,
    role: Role,
    meta?: { userAgent?: string; ipAddress?: string }
  ): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(userId, email, role);
    const rawRefreshToken = generateRefreshToken();
    const hashedToken = hashToken(rawRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepository.create({
      userId,
      token: hashedToken,
      expiresAt,
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: ACCESS_EXPIRES_SECONDS,
    };
  }

  async rotateRefreshToken(
    rawRefreshToken: string,
    meta?: { userAgent?: string; ipAddress?: string }
  ): Promise<AuthTokens> {
    const hashedToken = hashToken(rawRefreshToken);
    const storedToken = await refreshTokenRepository.findByToken(hashedToken);

    if (!storedToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    await refreshTokenRepository.revoke(hashedToken);

    const { userRepository } = await import('../repositories/User.repository');
    const user = await userRepository.findById(storedToken.userId.toString());

    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User account is inactive');
    }

    return this.generateTokenPair(user.id, user.email, user.role, meta);
  }

  async revokeRefreshToken(rawRefreshToken: string): Promise<void> {
    const hashedToken = hashToken(rawRefreshToken);
    await refreshTokenRepository.revoke(hashedToken);
  }
}

export const tokenService = new TokenService();
