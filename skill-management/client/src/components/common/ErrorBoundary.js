import React from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          {...this.props}
        />
      );
    }

    return this.props.children;
  }
}

// Error Fallback Component
const ErrorFallback = ({
  error,
  errorInfo,
  onReset,
  title = 'Something went wrong',
  subtitle = 'We apologize for the inconvenience',
  showError = false,
  showRefreshButton = true,
  showReportButton = true,
  onReport,
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        p: 3,
        textAlign: 'center',
        ...sx
      }}
    >
      <ErrorIcon
        sx={{
          fontSize: 64,
          color: theme.palette.error.main,
          mb: 2
        }}
      />

      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        {subtitle}
      </Typography>

      {showError && error && (
        <Box
          sx={{
            bgcolor: theme.palette.error.lighter,
            borderRadius: 1,
            p: 2,
            mb: 4,
            width: '100%',
            maxWidth: 600,
            overflow: 'auto'
          }}
        >
          <Typography
            variant="body2"
            component="pre"
            sx={{
              color: theme.palette.error.main,
              fontFamily: 'monospace',
              m: 0
            }}
          >
            {error.toString()}
            {errorInfo && errorInfo.componentStack}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        {showRefreshButton && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onReset}
          >
            Try Again
          </Button>
        )}

        {showReportButton && (
          <Button
            variant="outlined"
            startIcon={<BugIcon />}
            onClick={() => onReport?.(error, errorInfo)}
          >
            Report Issue
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Preset configurations for common use cases
export const ComponentErrorBoundary = (props) => (
  <ErrorBoundary
    title="Component Error"
    subtitle="This component failed to render properly"
    showError={process.env.NODE_ENV === 'development'}
    {...props}
  />
);

export const RouteErrorBoundary = (props) => (
  <ErrorBoundary
    title="Page Error"
    subtitle="We encountered an error while loading this page"
    showError={process.env.NODE_ENV === 'development'}
    {...props}
  />
);

export const FormErrorBoundary = (props) => (
  <ErrorBoundary
    title="Form Error"
    subtitle="An error occurred while processing the form"
    showError={false}
    {...props}
  />
);

// Usage example:
/*
// Basic usage
const MyComponent = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error reporting service
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
      }}
    >
      <ComponentThatMightError />
    </ErrorBoundary>
  );
};

// Using preset configurations
const MyPage = () => {
  return (
    <RouteErrorBoundary
      onReport={(error, errorInfo) => {
        // Send error report
        console.log('Reporting error:', error);
      }}
    >
      <PageContent />
    </RouteErrorBoundary>
  );
};

// Form with error boundary
const MyForm = () => {
  return (
    <FormErrorBoundary>
      <form>
        {/* Form fields */}
      </form>
    </FormErrorBoundary>
  );
};

// App-wide error boundary
const App = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error reporting service
      }}
      showError={process.env.NODE_ENV === 'development'}
    >
      <Router>
        <Routes>
          {/* App routes */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};
*/

export default ErrorBoundary;
