import { Request, Response } from 'express';
import { authService } from '../services/Auth.service';
import { ResponseHandler } from '../utils/ApiResponse';
import { HTTP_STATUS } from '../constants/httpStatus';

const getMeta = (req: Request) => ({
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip,
});

export class AuthController {
  register = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body, getMeta(req));
    ResponseHandler.success(res, 'Registration successful', result, HTTP_STATUS.CREATED);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.login(email, password, getMeta(req));
    ResponseHandler.success(res, 'Login successful', result);
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken, getMeta(req));
    ResponseHandler.success(res, 'Token refreshed', { tokens });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await authService.logout(req.user!.id, req.body.refreshToken, getMeta(req));
    ResponseHandler.success(res, 'Logout successful');
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getMe(req.user!.id);
    ResponseHandler.success(res, 'User retrieved', { user });
  };
}

export const authController = new AuthController();
