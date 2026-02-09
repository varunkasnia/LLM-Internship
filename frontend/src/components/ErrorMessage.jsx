export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-6 shadow-card text-center">
      <p className="text-red-800 font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
