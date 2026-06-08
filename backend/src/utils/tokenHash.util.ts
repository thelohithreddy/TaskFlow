import crypto from 'crypto';

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(40).toString('hex');
};
