import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../services/admin.service';
import { useAuth } from '../context/AuthContext';
import { Analytics } from '../types/task.types';
import { User } from '../types/user.types';
import { Task } from '../types/task.types';
import { Spinner } from '../components/ui/Spinner';
import { AnalyticsCards } from '../components/admin/AnalyticsCards';
import { UserTable } from '../components/admin/UserTable';
import { TaskTable } from '../components/tasks/TaskTable';
import { Pagination } from '../components/ui/Pagination';
import { PaginationMeta } from '../types/api.types';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPagination, setUserPagination] = useState<PaginationMeta | null>(null);
  const [taskPagination, setTaskPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [analyticsData, usersData, tasksData] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getUsers(userPage),
          adminService.getTasks(taskPage),
        ]);
        setAnalytics(analyticsData);
        setUsers(usersData.items);
        setUserPagination(usersData.pagination);
        setTasks(tasksData.items);
        setTaskPagination(tasksData.pagination);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userPage, taskPage]);

  const handleDeleteUser = async (targetUser: User) => {
    if (!confirm(`Delete user "${targetUser.name}"?`)) return;
    await adminService.deleteUser(targetUser.id);
    toast.success('User deleted');
    const usersData = await adminService.getUsers(userPage);
    setUsers(usersData.items);
    setUserPagination(usersData.pagination);
  };

  if (loading) {
    return <div className="loading-center"><Spinner /></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">Platform management and analytics</p>
        </div>
      </div>

      {analytics && <AnalyticsCards analytics={analytics} />}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>Users</h2>
        <UserTable users={users} currentUserId={user?.id} onDelete={handleDeleteUser} />
        {userPagination && <Pagination pagination={userPagination} onPageChange={setUserPage} />}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>All Tasks</h2>
        <TaskTable tasks={tasks} onEdit={() => {}} onDelete={() => {}} />
        {taskPagination && <Pagination pagination={taskPagination} onPageChange={setTaskPage} />}
      </div>
    </div>
  );
};
