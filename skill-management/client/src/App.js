import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import BudgetSubmission from './pages/faculty/BudgetSubmission';
import AttendanceManagement from './pages/faculty/AttendanceManagement';
import FeedbackView from './pages/faculty/FeedbackView';
import AssessmentCreation from './pages/faculty/AssessmentCreation';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import SkillRegistration from './pages/student/SkillRegistration';
import AttendanceView from './pages/student/AttendanceView';
import FeedbackSubmission from './pages/student/FeedbackSubmission';
import AssessmentTaking from './pages/student/AssessmentTaking';

// Skill Team Pages
import TeamDashboard from './pages/team/Dashboard';
import BudgetReview from './pages/team/BudgetReview';
import FeedbackAnalysis from './pages/team/FeedbackAnalysis';

// Error Pages
import NotFound from './pages/errors/NotFound';

// Hooks
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          !isAuthenticated ? <Login /> : <Navigate to="/" replace />
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Faculty Routes */}
          {user?.role === 'faculty' && (
            <>
              <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/budget-submission" element={<BudgetSubmission />} />
              <Route path="/faculty/attendance" element={<AttendanceManagement />} />
              <Route path="/faculty/feedback" element={<FeedbackView />} />
              <Route path="/faculty/assessment" element={<AssessmentCreation />} />
            </>
          )}

          {/* Student Routes */}
          {user?.role === 'student' && (
            <>
              <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/skills" element={<SkillRegistration />} />
              <Route path="/student/attendance" element={<AttendanceView />} />
              <Route path="/student/feedback" element={<FeedbackSubmission />} />
              <Route path="/student/assessment/:id" element={<AssessmentTaking />} />
            </>
          )}

          {/* Skill Team Routes */}
          {user?.role === 'skillTeam' && (
            <>
              <Route path="/" element={<Navigate to="/team/dashboard" replace />} />
              <Route path="/team/dashboard" element={<TeamDashboard />} />
              <Route path="/team/budget-review" element={<BudgetReview />} />
              <Route path="/team/feedback-analysis" element={<FeedbackAnalysis />} />
            </>
          )}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;
