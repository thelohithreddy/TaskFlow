import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const adminItems = [
  { to: '/admin', label: 'Admin', icon: '⚙️' },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">⚡</span>
        <span className="sidebar-title">TaskFlow Pro</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        {user?.role === 'admin' &&
          adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link btn-ghost" onClick={toggleTheme}>
          <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-role">{user?.role}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
