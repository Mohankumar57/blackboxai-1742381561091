import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';

const LoadingScreen = ({
  message = 'Loading...',
  fullScreen = true,
  height = '100vh',
  showSpinner = true,
  children
}) => {
  const theme = useTheme();

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: fullScreen ? '100vh' : height,
        width: '100%',
        backgroundColor: theme.palette.background.default
      }}
    >
      {showSpinner && (
        <CircularProgress
          size={40}
          thickness={4}
          sx={{
            mb: 2,
            color: theme.palette.primary.main
          }}
        />
      )}

      {message && (
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            maxWidth: '80%',
            mb: 1
          }}
        >
          {message}
        </Typography>
      )}

      {children && (
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      )}
    </Box>
  );

  return fullScreen ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.zIndex.modal + 1,
        backgroundColor: theme.palette.background.default
      }}
    >
      {content}
    </Box>
  ) : content;
};

// Loading overlay for components
export const LoadingOverlay = ({
  loading,
  children,
  message = 'Loading...',
  blur = true
}) => {
  const theme = useTheme();

  if (!loading) {
    return children;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          filter: blur ? 'blur(4px)' : 'none',
          pointerEvents: 'none'
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <CircularProgress
            size={32}
            thickness={4}
            sx={{
              mb: 1,
              color: theme.palette.primary.main
            }}
          />
          {message && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Skeleton loading placeholder
export const LoadingSkeleton = ({
  width = '100%',
  height = '100%',
  animation = 'pulse'
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width,
        height,
        backgroundColor: theme.palette.action.hover,
        borderRadius: theme.shape.borderRadius,
        animation: animation === 'pulse' ? 'pulse 1.5s ease-in-out infinite' : 'none',
        '@keyframes pulse': {
          '0%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.5
          },
          '100%': {
            opacity: 1
          }
        }
      }}
    />
  );
};

export default LoadingScreen;
