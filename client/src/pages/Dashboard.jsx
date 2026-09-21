import useTasks from '../hooks/useTasks';
import DashboardCard from '../components/DashboardCard';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

export default function Dashboard() {
  const { stats, status, error } = useTasks();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>

      <ErrorBanner message={error} />

      {status === 'loading' ? (
        <Spinner label="Loading dashboard..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard label="Total Tasks" value={stats.total} />
          <DashboardCard label="Pending" value={stats.pending} accentClass="text-amber-600" />
          <DashboardCard label="Completed" value={stats.completed} accentClass="text-emerald-600" />
          <DashboardCard label="In Progress" value={stats.inProgress} accentClass="text-blue-600" />
        </div>
      )}
    </div>
  );
}
