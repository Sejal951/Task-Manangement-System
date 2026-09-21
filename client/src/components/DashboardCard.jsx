import { memo } from 'react';

function DashboardCard({ label, value, accentClass }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-semibold mt-2 ${accentClass || 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

export default memo(DashboardCard);
