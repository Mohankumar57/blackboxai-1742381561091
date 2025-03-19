import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info', // 'info', 'warning', 'error', 'success'
  loading = false,
  maxWidth = 'sm',
  confirmButtonProps = {},
  cancelButtonProps = {},
  showCloseButton = true,
  children
}) => {
  const theme = useTheme();

  const getIcon = () => {
    const iconProps = {
      sx: {
        fontSize: 40,
        mb: 2
      }
    };

    switch (type) {
      case 'warning':
        return <WarningIcon {...iconProps} color="warning" />;
      case 'error':
        return <ErrorIcon {...iconProps} color="error" />;
      case 'success':
        return <SuccessIcon {...iconProps} color="success" />;
      default:
        return <InfoIcon {...iconProps} color="info" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'success':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          position: 'relative'
        }
      }}
    >
      {/* Close Button */}
      {showCloseButton && !loading && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Dialog Content */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {/* Icon */}
        {getIcon()}

        {/* Title */}
        <DialogTitle
          sx={{
            p: 0,
            mb: 2,
            color: getColor()
          }}
        >
          {title}
        </DialogTitle>

        {/* Message or Content */}
        <DialogContent sx={{ p: 0, mb: 3 }}>
          {message && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {message}
            </Typography>
          )}
          {children}
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ p: 0, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            color={type}
            {...confirmButtonProps}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

// Preset configurations for common use cases
export const DeleteConfirmDialog = (props) => (
  <ConfirmDialog
    title="Confirm Deletion"
    message="Are you sure you want to delete this item? This action cannot be undone."
    confirmText="Delete"
    type="error"
    {...props}
  />
);

export const SaveConfirmDialog = (props) => (
  <ConfirmDialog
    title="Save Changes"
    message="Are you sure you want to save these changes?"
    confirmText="Save"
    type="info"
    {...props}
  />
);

export const WarningConfirmDialog = (props) => (
  <ConfirmDialog
    title="Warning"
    type="warning"
    {...props}
  />
);

export const SuccessConfirmDialog = (props) => (
  <ConfirmDialog
    title="Success"
    type="success"
    confirmText="OK"
    showCloseButton={false}
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  const [open, setOpen] = useState(false);
  
  const handleConfirm = async () => {
    try {
      // Perform action
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={handleConfirm}
      message="Are you sure you want to delete this item?"
    />
  );
};
*/

export default ConfirmDialog;
