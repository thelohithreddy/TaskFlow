export const HeroDashboardPreview = () => (
  <div className="hero-mockup">
    <div className="mockup-bar">
      <div className="mockup-dots">
        <span /><span /><span />
      </div>
      <span className="mockup-bar-title">TaskFlow Pro — Dashboard</span>
    </div>
    <div className="mockup-content">
      <div className="mockup-stats">
        <div className="mockup-stat-card">
          <span className="mockup-stat-value">24</span>
          <span className="mockup-stat-label">Active Tasks</span>
        </div>
        <div className="mockup-stat-card">
          <span className="mockup-stat-value">18</span>
          <span className="mockup-stat-label">Completed</span>
        </div>
        <div className="mockup-stat-card accent">
          <span className="mockup-stat-value">6</span>
          <span className="mockup-stat-label">High Priority</span>
        </div>
      </div>

      <div className="mockup-panel">
        <div className="mockup-panel-header">
          <span>Recent Tasks</span>
          <span className="mockup-link">View all</span>
        </div>
        <div className="mockup-tasks">
          {[
            { title: 'Deploy v2.0 to production', priority: 'high', status: 'In Progress' },
            { title: 'Review API documentation', priority: 'medium', status: 'Pending' },
            { title: 'Security audit checklist', priority: 'critical', status: 'Pending' },
            { title: 'Update team onboarding docs', priority: 'low', status: 'Completed' },
          ].map((task) => (
            <div key={task.title} className="mockup-task-row">
              <div className="mockup-task-check" />
              <div className="mockup-task-info">
                <span className="mockup-task-title">{task.title}</span>
                <span className={`mockup-badge mockup-badge-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              <span className="mockup-task-status">{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
