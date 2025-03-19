import React from 'react';
import { ToastContainer as BaseToastContainer, toast } from 'react-toastify';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Box, Typography, IconButton, useTheme } from '@mui/material';

// Custom Toast Component
const CustomToast = ({ type, message, closeToast }) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: theme.palette.success.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        width: '100%',
        p: 0.5
      }}
    >
      {getIcon()}
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          mt: 0.25
        }}
      >
        {message}
      </Typography>
      <IconButton
        size="small"
        onClick={closeToast}
        sx={{
          mt: -0.5,
          mr: -1,
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary'
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

// Toast Container Component
export const ToastContainer = () => (
  <BaseToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    pauseOnHover
    theme="light"
  />
);

// Toast Functions
const createToast = (message, type) => {
  return toast(
    ({ closeToast }) => (
      <CustomToast
        type={type}
        message={message}
        closeToast={closeToast}
      />
    ),
    {
      type,
      closeButton: false,
      icon: false
    }
  );
};

export const showToast = {
  success: (message) => createToast(message, 'success'),
  error: (message) => createToast(message, 'error'),
  warning: (message) => createToast(message, 'warning'),
  info: (message) => createToast(message, 'info'),
  
  // Custom success messages
  skillCreated: () => createToast('Skill created successfully', 'success'),
  skillUpdated: () => createToast('Skill updated successfully', 'success'),
  skillDeleted: () => createToast('Skill deleted successfully', 'success'),
  
  // Custom error messages
  networkError: () => createToast('Network error. Please check your connection.', 'error'),
  serverError: () => createToast('Server error. Please try again later.', 'error'),
  validationError: (field) => createToast(`Please check the ${field} field.`, 'error'),
  
  // Custom warning messages
  sessionExpiring: () => createToast('Your session will expire soon. Please save your work.', 'warning'),
  unsavedChanges: () => createToast('You have unsaved changes.', 'warning'),
  
  // Custom info messages
  dataLoading: () => createToast('Loading data...', 'info'),
  dataRefreshed: () => createToast('Data refreshed successfully', 'info'),

  // Async operation messages
  promise: (promise, messages = {}) => {
    const {
      pending = 'Loading...',
      success = 'Operation completed successfully',
      error = 'Operation failed'
    } = messages;

    return toast.promise(promise, {
      pending: {
        render: ({ closeToast }) => (
          <CustomToast
            type="info"
            message={pending}
            closeToast={closeToast}
          />
        ),
        icon: false
      },
      success: {
        render: ({ closeToast }) => (
          <CustomToast
            type="success"
            message={success}
            closeToast={closeToast}
          />
        ),
        icon: false
      },
      error: {
        render: ({ closeToast, data }) => (
          <CustomToast
            type="error"
            message={data?.message || error}
            closeToast={closeToast}
          />
        ),
        icon: false
      }
    });
  }
};

// Usage example:
/*
// Basic usage
showToast.success('Operation completed successfully');
showToast.error('Something went wrong');
showToast.warning('Please review your input');
showToast.info('New updates available');

// Preset messages
showToast.skillCreated();
showToast.networkError();
showToast.sessionExpiring();
showToast.dataLoading();

// Promise handling
const asyncOperation = async () => {
  showToast.promise(
    fetch('https://api.example.com/data'),
    {
      pending: 'Fetching data...',
      success: 'Data fetched successfully',
      error: 'Failed to fetch data'
    }
  );
};

// In your App.js or layout component
const App = () => {
  return (
    <>
      <Router>
        {/* Your app routes */}
      </Router>
      <ToastContainer />
    </>
  );
};
*/

export default showToast;
