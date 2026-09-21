import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchTaskById } from '../services/taskService';
import { STATUS_LABELS, STATUS_CLASSES, PRIORITY_LABELS, PRIORITY_CLASSES } from '../utils/badges';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchTaskById(id)
      .then((data) => {
        if (!cancelled) setTask(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.friendlyMessage || 'Failed to load task');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner label="Loading task..." />;

  if (error) {
    return (
      <div>
        <ErrorBanner message={error} />
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="text-sm font-medium text-slate-700 border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link to="/tasks" className="text-sm text-slate-500 hover:underline">
        &larr; Back to Tasks
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mt-3">
        <div className="flex items-start justify-between gap-2 mb-4">
          <h1 className="text-2xl font-semibold text-slate-900">{task.title}</h1>
          <div className="flex gap-1 shrink-0">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_CLASSES[task.status]}`}>
              {STATUS_LABELS[task.status]}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${PRIORITY_CLASSES[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>
        </div>

        <p className="text-slate-600 mb-6">{task.description || 'No description provided.'}</p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Due Date</dt>
            <dd className="text-slate-900 font-medium">
              {new Date(task.dueDate).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Assigned User</dt>
            <dd className="text-slate-900 font-medium">{task.assignedUser?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Created By</dt>
            <dd className="text-slate-900 font-medium">{task.createdBy?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Created At</dt>
            <dd className="text-slate-900 font-medium">
              {new Date(task.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
