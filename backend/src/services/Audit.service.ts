import { auditLogRepository } from '../repositories/AuditLog.repository';
import { CreateAuditLogData } from '../repositories/interfaces/IAuditLogRepository';
import { buildPaginationMeta, parsePagination } from '../utils/pagination.util';
import { PaginationQuery } from '../types/api.types';

export class AuditService {
  async log(data: CreateAuditLogData) {
    return auditLogRepository.create(data);
  }

  async getRecentActivity(limit = 10) {
    return auditLogRepository.findRecent(limit);
  }

  async getAuditLogs(query: PaginationQuery) {
    const pagination = parsePagination(query);
    const { logs, total } = await auditLogRepository.findAll(pagination);
    return {
      items: logs,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }
}

export const auditService = new AuditService();
