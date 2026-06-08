import { IAuditLog } from '../../models/AuditLog.model';
import { AuditAction } from '../../constants/auditActions';
import { ParsedPagination } from '../../utils/pagination.util';

export interface CreateAuditLogData {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface IAuditLogRepository {
  create(data: CreateAuditLogData): Promise<IAuditLog>;
  findRecent(limit: number): Promise<IAuditLog[]>;
  findAll(pagination: ParsedPagination): Promise<{ logs: IAuditLog[]; total: number }>;
}
