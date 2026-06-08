import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/task.service';
import { adminService } from '../services/admin.service';
import { Task } from '../types/task.types';
import { Analytics } from '../types/task.types';
import { Spinner } from '../components/ui/Spinner';
import { AnalyticsCards } from '../components/admin/AnalyticsCards';
import { Badge } from '../components/ui/Badge';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const taskData = await taskService.getTasks({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
        setTasks(taskData.items);

        if (user?.role === 'admin') {
          const analyticsData = await adminService.getAnalytics();
          setAnalytics(analyticsData);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.role]);

  if (loading) {
    return <div className="loading-center"><Spinner /></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}</p>
        </div>
        <Link to="/tasks" className="btn btn-primary">
          + New Task
        </Link>
      </div>

      {analytics && <AnalyticsCards analytics={analytics} />}

      {!analytics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#4f46e520', color: '#4f46e5' }}>📋</div>
            <div className="stat-info">
              <span className="stat-value">{tasks.length}</span>
              <span className="stat-label">Recent Tasks</span>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">Recent Tasks</h2>
          <Link to="/tasks" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No tasks yet. <Link to="/tasks">Create your first task</Link>
          </p>
        ) : (
          <div className="recent-tasks">
            {tasks.map((task) => (
              <div key={task.id} className="recent-task-item">
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    Due {formatDate(task.dueDate)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Badge label={PRIORITY_LABELS[task.priority]} colorClass={PRIORITY_COLORS[task.priority]} />
                  <Badge label={STATUS_LABELS[task.status]} colorClass={STATUS_COLORS[task.status]} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {analytics && analytics.recentActivity.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>Recent Activity</h2>
          <div className="activity-list">
            {analytics.recentActivity.map((activity, i) => (
              <div key={i} className="activity-item">
                <span className="activity-dot" />
                <div>
                  <strong>{activity.userName}</strong>{' '}
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {activity.action.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
