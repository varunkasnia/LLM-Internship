import { useState, useEffect } from 'react';
import {
  markAttendance,
  getAttendanceList,
  getEmployees,
  getAttendanceByEmployee,
} from '../lib/api';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const initialForm = {
  employee_id: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'Present',
};

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeAttendance, setEmployeeAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  const loadEmployees = () => {
    getEmployees()
      .then((res) => setEmployees(res.data.employees || []))
      .catch(() => setEmployees([]));
  };

  const loadSummary = () => {
    getAttendanceList(filterDate ? { on_date: filterDate } : {})
      .then((res) => setSummary(res.data))
      .catch(() => setSummary({ records: [] }));
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getEmployees().then((r) => r.data.employees || []),
      getAttendanceList().then((r) => r.data),
    ])
      .then(([emps, sum]) => {
        setEmployees(emps);
        setSummary(sum);
      })
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!filterDate) loadSummary();
    else getAttendanceList({ on_date: filterDate }).then((r) => setSummary(r.data)).catch(() => setSummary({ records: [] }));
  }, [filterDate]);

  const loadEmployeeAttendance = (employeeId) => {
    setSelectedEmployee(employeeId);
    setEmployeeAttendance(null);
    if (!employeeId) return;
    getAttendanceByEmployee(employeeId, filterDate ? { from_date: filterDate, to_date: filterDate } : {})
      .then((res) => setEmployeeAttendance(res.data))
      .catch(() => setEmployeeAttendance(null));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!form.employee_id.trim()) {
      setSubmitError('Employee ID is required.');
      return;
    }
    setSubmitting(true);
    markAttendance({
      employee_id: form.employee_id.trim(),
      date: form.date,
      status: form.status,
    })
      .then(() => {
        setForm((f) => ({ ...initialForm, date: f.date }));
        loadSummary();
        if (selectedEmployee === form.employee_id.trim()) {
          getAttendanceByEmployee(form.employee_id.trim()).then((r) => setEmployeeAttendance(r.data));
        }
      })
      .catch((err) => {
        setSubmitError(err.response?.data?.detail || 'Failed to mark attendance.');
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  const records = summary?.records || [];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Attendance Management</h2>

      <section className="bg-white rounded-xl border border-slate-200 shadow-card p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Mark Attendance</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID *</label>
            <input
              type="text"
              value={form.employee_id}
              onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-input focus:shadow-input-focus outline-none transition-shadow"
              placeholder="e.g. EMP001"
              list="emp-list"
            />
            <datalist id="emp-list">
              {employees.map((e) => (
                <option key={e.id} value={e.employee_id} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-input focus:shadow-input-focus outline-none transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-input outline-none"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-card hover:shadow-card-hover disabled:opacity-60 transition-all"
            >
              {submitting ? 'Saving...' : 'Mark Attendance'}
            </button>
          </div>
          {submitError && <p className="text-red-600 text-sm sm:col-span-2">{submitError}</p>}
        </form>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-card p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h3 className="text-lg font-medium text-slate-800">Filter by date</h3>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
          {filterDate && (
            <button
              type="button"
              onClick={() => setFilterDate('')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          {filterDate ? `Attendance on ${filterDate}` : 'Recent attendance'}
        </h3>
        {records.length === 0 ? (
          <EmptyState
            message={filterDate ? 'No attendance on this date' : 'No attendance records yet'}
            subMessage={!filterDate ? 'Mark attendance using the form above.' : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Employee ID</th>
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Name</th>
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Date</th>
                  <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr
                    key={r.id || `${r.employee_id}-${r.date}`}
                    className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => loadEmployeeAttendance(r.employee_id)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">{r.employee_id}</td>
                    <td className="px-6 py-4 text-slate-700">{r.employee_name}</td>
                    <td className="px-6 py-4 text-slate-600">{r.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          r.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">View by employee</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={selectedEmployee || ''}
            onChange={(e) => loadEmployeeAttendance(e.target.value || null)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none min-w-[200px]"
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.employee_id}>
                {e.employee_id} – {e.full_name}
              </option>
            ))}
          </select>
        </div>
        {!selectedEmployee && (
          <EmptyState message="Select an employee to view attendance" />
        )}
        {selectedEmployee && !employeeAttendance && <Loading />}
        {selectedEmployee && employeeAttendance && (
          <div>
            <p className="text-slate-600 mb-2">
              <strong>{employeeAttendance.employee_name}</strong> ({employeeAttendance.employee_id})
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Present: {employeeAttendance.total_present} | Absent: {employeeAttendance.total_absent} | Total: {employeeAttendance.total}
            </p>
            {employeeAttendance.records.length === 0 ? (
              <EmptyState message="No attendance records for this employee" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Date</th>
                      <th className="text-left text-sm font-semibold text-slate-700 px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeAttendance.records.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100">
                        <td className="px-6 py-4 text-slate-700">{r.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                              r.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
