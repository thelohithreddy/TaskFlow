import { IRefreshToken } from '../../models/RefreshToken.model';

export interface CreateRefreshTokenData {
  userId: string;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface IRefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<IRefreshToken>;
  findByToken(token: string): Promise<IRefreshToken | null>;
  revoke(token: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
