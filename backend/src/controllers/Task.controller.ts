import { Request, Response } from 'express';
import { taskService } from '../services/Task.service';
import { ResponseHandler } from '../utils/ApiResponse';
import { HTTP_STATUS } from '../constants/httpStatus';
import { TaskPriority } from '../constants/taskPriority';
import { TaskStatus } from '../constants/taskStatus';

const getMeta = (req: Request) => ({
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip,
});

export class TaskController {
  create = async (req: Request, res: Response): Promise<void> => {
    const task = await taskService.createTask(req.user!.id, req.body, getMeta(req));
    ResponseHandler.success(res, 'Task created', { task }, HTTP_STATUS.CREATED);
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const result = await taskService.getTasks(req.user!.id, req.user!.role, {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      search: req.query.search as string,
      status: req.query.status as TaskStatus,
      priority: req.query.priority as TaskPriority,
      assignedTo: req.query.assignedTo as string,
    });
    ResponseHandler.paginated(res, 'Tasks retrieved', result);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const task = await taskService.getTaskById(String(req.params.id), req.user!.id, req.user!.role);
    ResponseHandler.success(res, 'Task retrieved', { task });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const task = await taskService.updateTask(
      String(req.params.id),
      req.user!.id,
      req.user!.role,
      req.body,
      getMeta(req)
    );
    ResponseHandler.success(res, 'Task updated', { task });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await taskService.deleteTask(String(req.params.id), req.user!.id, req.user!.role, getMeta(req));
    ResponseHandler.success(res, 'Task deleted');
  };
}

export const taskController = new TaskController();
