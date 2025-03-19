import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme
} from '@mui/material';
import {
  SentimentDissatisfied as SadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getHomeRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
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

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <SadIcon
          sx={{
            fontSize: 120,
            color: theme.palette.primary.main,
            mb: 4
          }}
        />

        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 2,
            color: theme.palette.text.primary
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: theme.palette.text.secondary,
            maxWidth: 500
          }}
        >
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or navigate back to the home page.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(getHomeRoute())}
            sx={{
              borderRadius: 2,
              px: 4
            }}
          >
            Go to Home
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2,
              px: 4
            }}
          >
            Go Back
          </Button>
        </Box>

        {/* Additional Help Section */}
        <Box
          sx={{
            mt: 8,
            p: 3,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 1,
            maxWidth: 600
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.text.primary
            }}
          >
            Need Help?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2
            }}
          >
            If you believe this is an error or need assistance, please try:
          </Typography>

          <Box
            component="ul"
            sx={{
              textAlign: 'left',
              color: theme.palette.text.secondary
            }}
          >
            <li>Checking the URL for typos</li>
            <li>Clearing your browser cache</li>
            <li>Contacting the system administrator</li>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
