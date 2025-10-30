import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SchedulerPage from './pages/SchedulerPage'; // 1. Import the new page

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="" element={<DashboardPage />} />
          </Route>
          <Route path="/project/:projectId" element={<PrivateRoute />}>
            <Route path="" element={<ProjectDetailPage />} />
          </Route>
          
          {/* 2. Add the new route here */}
          <Route path="/project/:projectId/schedule" element={<PrivateRoute />}>
            <Route path="" element={<SchedulerPage />} />
          </Route>
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;