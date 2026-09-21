export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm py-10">
      <span className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
      {label}
    </div>
  );
}
