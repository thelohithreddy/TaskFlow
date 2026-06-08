import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '../services/task.service';
import { Task } from '../types/task.types';
import { PaginationMeta } from '../types/api.types';
import { useDebounce } from '../hooks/useDebounce';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { Pagination } from '../components/ui/Pagination';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilters } from '../components/tasks/TaskFilters';

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const debouncedSearch = useDebounce(search);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status: status as Task['status'] || undefined,
        priority: priority as Task['priority'] || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setTasks(data.items);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, priority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, priority]);

  const handleCreate = async (data: Parameters<typeof taskService.createTask>[0]) => {
    await taskService.createTask(data);
    toast.success('Task created');
    setModalOpen(false);
    fetchTasks();
  };

  const handleUpdate = async (data: Parameters<typeof taskService.createTask>[0]) => {
    if (!editingTask) return;
    await taskService.updateTask(editingTask.id, data);
    toast.success('Task updated');
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (task: Task) => {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    await taskService.deleteTask(task.id);
    toast.success('Task deleted');
    fetchTasks();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p className="page-subtitle">Manage and track your work</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setModalOpen(true); }}>
          + New Task
        </Button>
      </div>

      <div className="card">
        <TaskFilters
          search={search}
          status={status}
          priority={priority}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
        />

        {loading ? (
          <div className="loading-center"><Spinner /></div>
        ) : (
          <>
            <TaskTable
              tasks={tasks}
              onEdit={(task) => { setEditingTask(task); setModalOpen(true); }}
              onDelete={handleDelete}
            />
            {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          initial={editingTask || undefined}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingTask(null); }}
        />
      </Modal>
    </div>
  );
};
