import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../lib/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const cards = [
  { key: 'total_employees', label: 'Total Employees', href: '/employees', color: 'primary' },
  { key: 'total_attendance_records', label: 'Attendance Records', href: '/attendance', color: 'slate' },
  { key: 'total_present', label: 'Present Days', color: 'emerald' },
  { key: 'total_absent', label: 'Absent Days', color: 'amber' },
];

const colorClasses = {
  primary: 'bg-primary-500 text-white shadow-lg shadow-primary-500/25',
  slate: 'bg-slate-700 text-white shadow-lg shadow-slate-700/25',
  emerald: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25',
  amber: 'bg-amber-500 text-white shadow-lg shadow-amber-500/25',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ key, label, href, color }) => (
          <div
            key={key}
            className={`rounded-xl p-6 ${colorClasses[color]} transition-shadow hover:shadow-card-hover`}
          >
            <p className="text-sm opacity-90 font-medium">{label}</p>
            <p className="text-3xl font-bold mt-2">{data[key] ?? 0}</p>
            {href && (
              <Link
                to={href}
                className="inline-block mt-3 text-sm font-medium opacity-90 hover:underline"
              >
                View →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
