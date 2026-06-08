import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export const PublicLayout = () => (
  <div className="public-layout">
    <Navbar />
    <main>
      <Outlet />
    </main>
  </div>
);
