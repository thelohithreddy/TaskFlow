export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
  critical: 'badge-critical',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-pending',
  in_progress: 'badge-progress',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};
