import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has access to the current route based on their role
  const currentPath = location.pathname;
  const userRole = user?.role;

  if (
    (currentPath.startsWith('/faculty') && userRole !== 'faculty') ||
    (currentPath.startsWith('/student') && userRole !== 'student') ||
    (currentPath.startsWith('/team') && userRole !== 'skillTeam')
  ) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'faculty':
        return <Navigate to="/faculty/dashboard" replace />;
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'skillTeam':
        return <Navigate to="/team/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
