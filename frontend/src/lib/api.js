import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Employees
export const createEmployee = (data) => api.post('/employees', data);
export const getEmployees = () => api.get('/employees');
export const deleteEmployee = (employeeId) => api.delete(`/employees/${employeeId}`);

// Attendance
export const markAttendance = (data) => api.post('/attendance', data);
export const getAttendanceByEmployee = (employeeId, params) =>
  api.get(`/attendance/${employeeId}`, { params });
export const getAttendanceList = (params) => api.get('/attendance', { params });

// Dashboard
export const getDashboard = () => api.get('/dashboard');
