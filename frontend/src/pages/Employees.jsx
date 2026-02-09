import { useState, useEffect } from 'react';
import {
  createEmployee,
  getEmployees,
  deleteEmployee,
} from '../lib/api';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const initialForm = {
  employee_id: '',
  full_name: '',
  email: '',
  department: '',
};

export default function Employees() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getEmployees()
      .then((res) => setList(res.data.employees || []))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!form.employee_id.trim() || !form.full_name.trim() || !form.email.trim() || !form.department.trim()) {
      setSubmitError('All fields are required.');
      return;
    }
    setSubmitting(true);
    createEmployee({
      employee_id: form.employee_id.trim(),
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      department: form.department.trim(),
    })
      .then(() => {
        setForm(initialForm);
        load();
      })
      .catch((err) => {
        setSubmitError(err.response?.data?.detail || 'Failed to add employee.');
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (employeeId) => {
    if (!confirm('Delete this employee? Attendance records will also be removed.')) return;
    setDeletingId(employeeId);
    deleteEmployee(employeeId)
      .then(load)
      .catch((err) => setError(err.response?.data?.detail || 'Failed to delete.'))
      .finally(() => setDeletingId(null));
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Employee Management</h2>

      <section className="bg-white rounded-xl border border-slate-200 shadow-card p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Add Employee</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID *</label>
            <input
              type="text"
              value={form.employee_id}
              onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-input focus:shadow-input-focus outline-none transition-shadow"
              placeholder="e.g. EMP001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-input focus:shadow-input-focus outline-none transition-shadow"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-input focus:shadow-input-focus outline-none transition-shadow"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-input focus:shadow-input-focus outline-none transition-shadow"
              placeholder="Engineering"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-card hover:shadow-card-hover disabled:opacity-60 transition-all"
            >
              {submitting ? 'Adding...' : 'Add Employee'}
            </button>
            {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <h3 className="text-lg font-medium text-slate-800 p-6 pb-0">All Employees</h3>
        {list.length === 0 ? (
          <EmptyState
            message="No employees yet"
            subMessage="Add an employee using the form above."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Employee ID</th>
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Name</th>
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Email</th>
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Department</th>
                  <th className="text-right text-sm font-semibold text-slate-700 px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">{emp.employee_id}</td>
                    <td className="px-6 py-4 text-slate-700">{emp.full_name}</td>
                    <td className="px-6 py-4 text-slate-600">{emp.email}</td>
                    <td className="px-6 py-4 text-slate-600">{emp.department}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(emp.employee_id)}
                        disabled={deletingId === emp.employee_id}
                        className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                      >
                        {deletingId === emp.employee_id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
