import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CreateTaskData, Task, TaskPriority, TaskStatus } from '../../types/task.types';

interface TaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm = ({ initial, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(initial?.status || 'pending');
  const [dueDate, setDueDate] = useState(
    initial?.dueDate ? initial.dueDate.split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        status,
        dueDate: dueDate || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <Input
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <div className="modal-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
