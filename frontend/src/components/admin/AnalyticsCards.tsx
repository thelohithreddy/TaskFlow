import { Analytics } from '../../types/task.types';

interface AnalyticsCardsProps {
  analytics: Analytics;
}

const cards = [
  { key: 'totalUsers', label: 'Total Users', icon: '👥', color: '#4f46e5' },
  { key: 'totalTasks', label: 'Total Tasks', icon: '📋', color: '#0891b2' },
  { key: 'completedTasks', label: 'Completed', icon: '✅', color: '#22c55e' },
  { key: 'pendingTasks', label: 'Pending', icon: '⏳', color: '#f59e0b' },
  { key: 'highPriorityTasks', label: 'High Priority', icon: '🔥', color: '#ef4444' },
] as const;

export const AnalyticsCards = ({ analytics }: AnalyticsCardsProps) => (
  <div className="stats-grid">
    {cards.map((card) => (
      <div key={card.key} className="stat-card">
        <div className="stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
          {card.icon}
        </div>
        <div className="stat-info">
          <span className="stat-value">{analytics[card.key]}</span>
          <span className="stat-label">{card.label}</span>
        </div>
      </div>
    ))}
  </div>
);
