import { useState, useEffect } from 'react';
import api from '../api';

const AttendanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({ date: '', status: 'Present' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  const fetchAttendance = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    try {
      const response = await api.get(`/attendance/${selectedEmployee}`);
      setAttendance(response.data);
    } catch (err) {
      setError('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setError('Select an employee');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/attendance/', { ...form, employee_id: selectedEmployee });
      setForm({ date: '', status: 'Present' });
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance Management</h1>
      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Employee</h2>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.employee_id}>
              {emp.employee_id} - {emp.full_name}
            </option>
          ))}
        </select>
      </div>
      {selectedEmployee && (
        <>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Mark Attendance</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <button type="submit" disabled={loading} className="md:col-span-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition duration-200">
                {loading ? 'Marking...' : 'Mark Attendance'}
              </button>
            </form>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Attendance Records</h2>
            {loading && <p className="text-gray-600">Loading...</p>}
            <div className="space-y-4">
              {attendance.map((att) => (
                <div key={att.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                  <p className="font-semibold text-gray-800">{att.date}</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${att.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {att.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceManagement;