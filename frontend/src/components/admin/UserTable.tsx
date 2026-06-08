import { User } from '../../types/user.types';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatDate';

interface UserTableProps {
  users: User[];
  currentUserId?: string;
  onDelete: (user: User) => void;
}

export const UserTable = ({ users, currentUserId, onDelete }: UserTableProps) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <span className={`badge ${user.role === 'admin' ? 'badge-high' : 'badge-medium'}`}>
                {user.role}
              </span>
            </td>
            <td>
              <span className={`badge ${user.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td>{formatDate(user.createdAt)}</td>
            <td>
              {user.id !== currentUserId && (
                <Button variant="danger" size="sm" onClick={() => onDelete(user)}>
                  Delete
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
