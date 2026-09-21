import { useEffect, useState } from 'react';
import { isRequired } from '../utils/validators';
import ErrorBanner from './ErrorBanner';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  status: 'pending',
  assignedUser: '',
};

export default function TaskForm({ initialTask, users, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'medium',
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : '',
        status: initialTask.status || 'pending',
        assignedUser: initialTask.assignedUser?._id || initialTask.assignedUser || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialTask]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const errors = {};
    if (!isRequired(form.title)) errors.title = 'Title is required';
    if (!isRequired(form.dueDate)) errors.dueDate = 'Due date is required';
    if (!isRequired(form.assignedUser)) errors.assignedUser = 'Assigned user is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    try {
      await onSubmit(form);
    } catch (err) {
      const message =
        err?.friendlyMessage || err?.message || (typeof err === 'string' ? err : null);
      setFormError(message || 'Failed to save task');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      <ErrorBanner message={formError} />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
        {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
          {fieldErrors.dueDate && <p className="text-xs text-red-600 mt-1">{fieldErrors.dueDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Assigned User</label>
          <select
            value={form.assignedUser}
            onChange={(e) => handleChange('assignedUser', e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          {fieldErrors.assignedUser && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.assignedUser}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-slate-700 border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
