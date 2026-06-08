import { Task } from '../../types/task.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatDate';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const getUserName = (user: Task['createdBy']): string => {
  if (!user) return '—';
  if (typeof user === 'string') return user;
  return user.name;
};

export const TaskTable = ({ tasks, onEdit, onDelete }: TaskTableProps) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Due Date</th>
          <th>Created By</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
              No tasks found
            </td>
          </tr>
        ) : (
          tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>
                {task.description && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    {task.description.slice(0, 60)}
                    {task.description.length > 60 ? '...' : ''}
                  </div>
                )}
              </td>
              <td>
                <Badge label={PRIORITY_LABELS[task.priority]} colorClass={PRIORITY_COLORS[task.priority]} />
              </td>
              <td>
                <Badge label={STATUS_LABELS[task.status]} colorClass={STATUS_COLORS[task.status]} />
              </td>
              <td>{formatDate(task.dueDate)}</td>
              <td>{getUserName(task.createdBy)}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(task)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
