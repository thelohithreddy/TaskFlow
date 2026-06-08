import { Request, Response } from 'express';
import { adminService } from '../services/Admin.service';
import { auditService } from '../services/Audit.service';
import { ResponseHandler } from '../utils/ApiResponse';
import { TaskPriority } from '../constants/taskPriority';
import { TaskStatus } from '../constants/taskStatus';

const getMeta = (req: Request) => ({
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip,
});

export class AdminController {
  getUsers = async (req: Request, res: Response): Promise<void> => {
    const result = await adminService.getAllUsers({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    });
    ResponseHandler.paginated(res, 'Users retrieved', result);
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    await adminService.deleteUser(req.user!.id, String(req.params.id), getMeta(req));
    ResponseHandler.success(res, 'User deleted');
  };

  getTasks = async (req: Request, res: Response): Promise<void> => {
    const result = await adminService.getAllTasks({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      search: req.query.search as string,
      status: req.query.status as TaskStatus,
      priority: req.query.priority as TaskPriority,
    });
    ResponseHandler.paginated(res, 'Tasks retrieved', result);
  };

  getAnalytics = async (_req: Request, res: Response): Promise<void> => {
    const analytics = await adminService.getAnalytics();
    ResponseHandler.success(res, 'Analytics retrieved', analytics);
  };

  getAuditLogs = async (req: Request, res: Response): Promise<void> => {
    const result = await auditService.getAuditLogs({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    });
    ResponseHandler.paginated(res, 'Audit logs retrieved', result);
  };
}

export const adminController = new AdminController();
