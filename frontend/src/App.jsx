import { useState } from 'react';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'employees':
        return <EmployeeManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">HRMS Lite</h1>
            </div>
            <div className="flex space-x-8">
              <button onClick={() => setPage('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${page === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Dashboard
              </button>
              <button onClick={() => setPage('employees')} className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${page === 'employees' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Employees
              </button>
              <button onClick={() => setPage('attendance')} className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${page === 'attendance' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Attendance
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
