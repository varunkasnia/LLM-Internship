import { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, totalPresent: 0, totalAbsent: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const employeesRes = await api.get('/employees/');
      const totalEmployees = employeesRes.data.length;

      const attendanceRes = await api.get('/attendance/');
      const totalPresent = attendanceRes.data.filter(att => att.status === 'Present').length;
      const totalAbsent = attendanceRes.data.filter(att => att.status === 'Absent').length;

      setStats({ totalEmployees, totalPresent, totalAbsent });
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Dashboard</h1>
      {loading && <p className="text-gray-600 text-center">Loading...</p>}
      <div className="space-y-6">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Total Employees</h2>
          <p className="text-5xl font-bold text-blue-600 text-center">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Total Present Days</h2>
          <p className="text-5xl font-bold text-green-600 text-center">{stats.totalPresent}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Total Absent Days</h2>
          <p className="text-5xl font-bold text-red-600 text-center">{stats.totalAbsent}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;