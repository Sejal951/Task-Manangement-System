import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-200 px-4 md:px-6 py-3">
      <div className="font-semibold text-slate-800 md:hidden">TaskFlow</div>
      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-slate-600">
          Signed in as <span className="font-medium text-slate-900">{user?.name}</span>
        </span>
        <button
          type="button"
          onClick={logout}
          className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
