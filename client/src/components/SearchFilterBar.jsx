import { memo } from 'react';

function SearchFilterBar({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 bg-white border border-slate-200 rounded-lg p-4 mb-4">
      <input
        type="text"
        placeholder="Search by title..."
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
        className="flex-1 min-w-[180px] border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
        className="border border-slate-300 rounded-md px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value })}
        className="border border-slate-300 rounded-md px-3 py-2 text-sm"
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={filters.sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value })}
        className="border border-slate-300 rounded-md px-3 py-2 text-sm"
      >
        <option value="dueDate_asc">Due date: earliest first</option>
        <option value="dueDate_desc">Due date: latest first</option>
      </select>
    </div>
  );
}

export default memo(SearchFilterBar);
