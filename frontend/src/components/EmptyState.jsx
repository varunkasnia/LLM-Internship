export default function EmptyState({ message, subMessage }) {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-xl border border-slate-200 shadow-card">
      <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-slate-700 font-medium">{message}</p>
      {subMessage && <p className="text-slate-500 text-sm mt-1">{subMessage}</p>}
    </div>
  );
}
