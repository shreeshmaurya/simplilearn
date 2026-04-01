import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AppLayout from './components/layout/AppLayout';
import HRDashboard from './components/dashboard/HRDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import EmployeeList from './components/employees/EmployeeList';
import EmployeeProfile from './components/employees/EmployeeProfile';
import LeaveManagement from './components/leave/LeaveManagement';
import EmployeeLeave from './components/leave/EmployeeLeave';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* HR routes */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute requiredRole="hr">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<HRDashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="leave-management" element={<LeaveManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Employee routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute requiredRole="employee">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="leave" element={<EmployeeLeave />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
