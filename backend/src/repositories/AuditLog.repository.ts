import { AuditLog } from '../models/AuditLog.model';
import {
  CreateAuditLogData,
  IAuditLogRepository,
} from './interfaces/IAuditLogRepository';
import { ParsedPagination } from '../utils/pagination.util';

export class AuditLogRepository implements IAuditLogRepository {
  async create(data: CreateAuditLogData) {
    return AuditLog.create(data);
  }

  async findRecent(limit: number) {
    return AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email');
  }

  async findAll(pagination: ParsedPagination) {
    const [logs, total] = await Promise.all([
      AuditLog.find()
        .sort(pagination.sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('userId', 'name email'),
      AuditLog.countDocuments(),
    ]);
    return { logs, total };
  }
}

export const auditLogRepository = new AuditLogRepository();
