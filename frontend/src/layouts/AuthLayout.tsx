import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => (
  <div className="auth-layout">
    <div className="auth-card">
      <Link to="/" className="auth-brand">
        <span>⚡</span> TaskFlow Pro
      </Link>
      <Outlet />
    </div>
  </div>
);
