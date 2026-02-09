export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm font-medium">Loading...</p>
    </div>
  );
}
