import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';

import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import StudentsPage from '../pages/Students/StudentsPage';
import TeachersPage from '../pages/Teachers/TeachersPage';
import ClassroomsPage from '../pages/Classrooms/ClassroomsPage';
import SubjectsPage from '../pages/Subjects/SubjectsPage';
import AssignmentsPage from '../pages/Assignments/AssignmentsPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import CreateAttendancePage from '../pages/Attendance/CreateAttendancePage';
import AttendanceHistoryPage from '../pages/Attendance/AttendanceHistoryPage';
import GradesPage from '../pages/Grades/GradesPage';

function AuthRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AuthRedirect />} />

        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Admin only routes */}
          <Route path="/students" element={
            <PrivateRoute requiredRole="administrador"><StudentsPage /></PrivateRoute>
          } />
          <Route path="/teachers" element={
            <PrivateRoute requiredRole="administrador"><TeachersPage /></PrivateRoute>
          } />
          <Route path="/classrooms" element={
            <PrivateRoute requiredRole="administrador"><ClassroomsPage /></PrivateRoute>
          } />
          <Route path="/subjects" element={
            <PrivateRoute requiredRole="administrador"><SubjectsPage /></PrivateRoute>
          } />
          <Route path="/assignments" element={
            <PrivateRoute requiredRole="administrador"><AssignmentsPage /></PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute requiredRole="administrador"><ReportsPage /></PrivateRoute>
          } />

          {/* Teacher routes */}
          <Route path="/attendance/create" element={
            <PrivateRoute requiredRole="docente"><CreateAttendancePage /></PrivateRoute>
          } />
          <Route path="/attendance/history" element={
            <PrivateRoute requiredRole="docente"><AttendanceHistoryPage /></PrivateRoute>
          } />
          <Route path="/grades" element={
            <PrivateRoute requiredRole="docente"><GradesPage /></PrivateRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
