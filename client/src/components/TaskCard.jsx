import { memo } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_LABELS, STATUS_CLASSES, PRIORITY_LABELS, PRIORITY_CLASSES } from '../utils/badges';

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/tasks/${task._id}`} className="font-medium text-slate-900 hover:underline">
          {task.title}
        </Link>
        <div className="flex gap-1 shrink-0">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_CLASSES[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${PRIORITY_CLASSES[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 line-clamp-2">{task.description || 'No description'}</p>
      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
        <span>Assigned to {task.assignedUser?.name || 'Unknown'}</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="text-xs font-medium text-slate-700 border border-slate-300 rounded-md px-2 py-1 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="text-xs font-medium text-red-700 border border-red-200 rounded-md px-2 py-1 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default memo(TaskCard);
