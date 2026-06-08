import { RefreshToken } from '../models/RefreshToken.model';
import {
  CreateRefreshTokenData,
  IRefreshTokenRepository,
} from './interfaces/IRefreshTokenRepository';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: CreateRefreshTokenData) {
    return RefreshToken.create(data);
  }

  async findByToken(token: string) {
    return RefreshToken.findOne({ token, isRevoked: false, expiresAt: { $gt: new Date() } });
  }

  async revoke(token: string) {
    await RefreshToken.updateOne({ token }, { isRevoked: true });
  }

  async revokeAllForUser(userId: string) {
    await RefreshToken.updateMany({ userId, isRevoked: false }, { isRevoked: true });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
