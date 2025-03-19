import React from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  IconButton,
  Collapse,
  Box,
  Typography,
  useTheme,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Styled Alert component
const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '& .MuiAlert-icon': {
    fontSize: 24
  }
}));

const Alert = ({
  severity = 'info', // 'success', 'error', 'warning', 'info'
  variant = 'standard', // 'standard', 'filled', 'outlined'
  title,
  message,
  action,
  icon,
  showIcon = true,
  closable = true,
  onClose,
  autoHideDuration,
  sx = {}
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  // Handle close
  const handleClose = (event) => {
    setOpen(false);
    onClose?.(event);
  };

  // Auto hide
  React.useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration]);

  // Get icon based on severity
  const getIcon = () => {
    if (icon) return icon;

    switch (severity) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Collapse in={open}>
      <StyledAlert
        severity={severity}
        variant={variant}
        icon={showIcon ? getIcon() : false}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {action}
            {closable && (
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ ml: action ? 1 : 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
        sx={{
          ...sx,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 600 }}>
            {title}
          </AlertTitle>
        )}
        {typeof message === 'string' ? (
          <Typography variant="body2">
            {message}
          </Typography>
        ) : (
          message
        )}
      </StyledAlert>
    </Collapse>
  );
};

// Preset configurations for common use cases
export const SuccessAlert = ({ title = 'Success', ...props }) => (
  <Alert
    severity="success"
    title={title}
    {...props}
  />
);

export const ErrorAlert = ({ title = 'Error', ...props }) => (
  <Alert
    severity="error"
    title={title}
    {...props}
  />
);

export const WarningAlert = ({ title = 'Warning', ...props }) => (
  <Alert
    severity="warning"
    title={title}
    {...props}
  />
);

export const InfoAlert = ({ title = 'Info', ...props }) => (
  <Alert
    severity="info"
    title={title}
    {...props}
  />
);

// Custom alerts for specific use cases
export const NetworkErrorAlert = ({ onRetry, ...props }) => (
  <Alert
    severity="error"
    title="Network Error"
    message="Unable to connect to the server. Please check your internet connection."
    action={
      onRetry && (
        <IconButton
          size="small"
          onClick={onRetry}
          sx={{ mr: 1 }}
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      )
    }
    {...props}
  />
);

export const SessionExpiringAlert = ({ onExtend, ...props }) => (
  <Alert
    severity="warning"
    title="Session Expiring"
    message="Your session will expire soon. Would you like to extend it?"
    action={
      onExtend && (
        <Button
          size="small"
          onClick={onExtend}
          sx={{ mr: 1 }}
        >
          Extend Session
        </Button>
      )
    }
    {...props}
  />
);

export const SkillCompletedAlert = ({ skill, onViewCertificate, ...props }) => (
  <Alert
    severity="success"
    title="Skill Completed"
    message={
      <Box>
        <Typography variant="body2" gutterBottom>
          Congratulations! You have successfully completed {skill.name}.
        </Typography>
        {skill.score && (
          <Typography variant="body2" color="success.main">
            Final Score: {skill.score}%
          </Typography>
        )}
      </Box>
    }
    action={
      onViewCertificate && (
        <Button
          size="small"
          onClick={onViewCertificate}
          sx={{ mr: 1 }}
        >
          View Certificate
        </Button>
      )
    }
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Alert
        severity="success"
        title="Success"
        message="Operation completed successfully"
      />

      <Alert
        severity="error"
        variant="filled"
        title="Error"
        message="Something went wrong"
        action={
          <Button color="inherit" size="small">
            Retry
          </Button>
        }
      />

      <Alert
        severity="warning"
        variant="outlined"
        message="Please review your input"
        closable={false}
      />

      <Alert
        severity="info"
        message="New updates available"
        autoHideDuration={5000}
      />

      <NetworkErrorAlert
        onRetry={() => console.log('Retrying...')}
      />

      <SessionExpiringAlert
        onExtend={() => console.log('Extending session...')}
      />

      <SkillCompletedAlert
        skill={{ name: 'React Basics', score: 95 }}
        onViewCertificate={() => console.log('Viewing certificate...')}
      />
    </Box>
  );
};
*/

export default Alert;
