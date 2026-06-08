import { User } from '../models/User.model';
import {
  CreateUserData,
  IUserRepository,
  UpdateUserData,
} from './interfaces/IUserRepository';
import { ParsedPagination } from '../utils/pagination.util';

export class UserRepository implements IUserRepository {
  async create(data: CreateUserData) {
    return User.create(data);
  }

  async findById(id: string) {
    return User.findOne({ _id: id, isDeleted: false });
  }

  async findByEmail(email: string, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (includePassword) {
      query.select('+password');
    }
    return query;
  }

  async findAll(pagination: ParsedPagination) {
    const filter = { isDeleted: false };
    const [users, total] = await Promise.all([
      User.find(filter).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit),
      User.countDocuments(filter),
    ]);
    return { users, total };
  }

  async update(id: string, data: UpdateUserData) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async softDelete(id: string) {
    return User.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), isActive: false },
      { new: true }
    );
  }

  async count(filter: Record<string, unknown> = {}) {
    return User.countDocuments({ isDeleted: false, ...filter });
  }
}

export const userRepository = new UserRepository();
