import { Request, Response } from 'express';
import { userService } from '../services/User.service';
import { ResponseHandler } from '../utils/ApiResponse';

const getMeta = (req: Request) => ({
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip,
});

export class UserController {
  getProfile = async (req: Request, res: Response): Promise<void> => {
    const user = await userService.getProfile(req.user!.id);
    ResponseHandler.success(res, 'Profile retrieved', { user });
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const user = await userService.updateProfile(req.user!.id, req.body, getMeta(req));
    ResponseHandler.success(res, 'Profile updated', { user });
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    await userService.changePassword(
      req.user!.id,
      { currentPassword: req.body.currentPassword, newPassword: req.body.newPassword },
      getMeta(req)
    );
    ResponseHandler.success(res, 'Password changed successfully');
  };
}

export const userController = new UserController();
