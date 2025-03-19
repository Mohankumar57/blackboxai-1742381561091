import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load Google Sign-In script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadGoogleScript();

    // Initialize Google Sign-In
    window.google?.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the button
    window.google?.accounts.id.renderButton(
      document.getElementById('google-signin'),
      {
        theme: 'outline',
        size: 'large',
        width: 250,
        logo_alignment: 'center'
      }
    );
  }, []);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || getDefaultRoute(user.role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const getDefaultRoute = (role) => {
    switch (role) {
      case 'faculty':
        return '/faculty/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'skillTeam':
        return '/team/dashboard';
      default:
        return '/';
    }
  };

  const handleGoogleResponse = (response) => {
    if (response.credential) {
      handleGoogleLogin(response);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'primary.main',
              textAlign: 'center'
            }}
          >
            Skill Management System
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            Sign in with your institutional email
          </Typography>

          <Alert
            severity="info"
            sx={{
              mb: 3,
              width: '100%'
            }}
          >
            Use your @bitsathy.ac.in email to sign in
          </Alert>

          <Box
            id="google-signin"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              mb: 2
            }}
          />

          {/* Loading state */}
          {false && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 3,
              textAlign: 'center'
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
