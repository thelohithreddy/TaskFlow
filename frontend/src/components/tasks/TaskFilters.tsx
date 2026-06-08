interface TaskFiltersProps {
  search: string;
  status: string;
  priority: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export const TaskFilters = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) => (
  <div className="task-filters">
    <input
      className="form-input"
      placeholder="Search tasks..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <select className="form-input" value={status} onChange={(e) => onStatusChange(e.target.value)}>
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
    <select className="form-input" value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
      <option value="">All Priorities</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </select>
  </div>
);
