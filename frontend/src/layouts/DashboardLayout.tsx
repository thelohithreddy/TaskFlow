import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';

export const DashboardLayout = () => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="dashboard-main">
      <Outlet />
    </main>
  </div>
);
