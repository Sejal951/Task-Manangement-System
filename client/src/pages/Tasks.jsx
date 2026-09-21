import { useState } from 'react';
import useTasks from '../hooks/useTasks';
import useUsers from '../hooks/useUsers';
import SearchFilterBar from '../components/SearchFilterBar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

export default function Tasks() {
  const {
    tasks,
    allTasksCount,
    status,
    error,
    filters,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();
  const { users } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreateForm() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTask(null);
  }

  async function handleSubmit(form) {
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, form);
      } else {
        await createTask(form);
      }
      closeForm();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    await deleteTask(task._id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
        <button
          type="button"
          onClick={openCreateForm}
          className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800"
        >
          + New Task
        </button>
      </div>

      <ErrorBanner message={error} />

      {showForm && (
        <div className="mb-6">
          <TaskForm
            initialTask={editingTask}
            users={users}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={submitting}
          />
        </div>
      )}

      <SearchFilterBar filters={filters} onChange={updateFilters} />

      {status === 'loading' ? (
        <Spinner label="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <p className="text-sm text-slate-500 py-10 text-center">
          {allTasksCount === 0 ? 'No tasks yet. Create your first task above.' : 'No tasks match your filters.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={openEditForm} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
