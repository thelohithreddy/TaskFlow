import { IUser } from '../../models/User.model';
import { Role } from '../../constants/roles';
import { ParsedPagination } from '../../utils/pagination.util';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  lastLoginAt?: Date;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string, includePassword?: boolean): Promise<IUser | null>;
  findAll(pagination: ParsedPagination): Promise<{ users: IUser[]; total: number }>;
  update(id: string, data: UpdateUserData): Promise<IUser | null>;
  softDelete(id: string): Promise<IUser | null>;
  count(filter?: Record<string, unknown>): Promise<number>;
}
