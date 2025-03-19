import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  useTheme,
  LinearProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  maxWidth = 'sm',
  loading = false,
  disabled = false,
  showCloseButton = true,
  preventCloseOnSubmit = false,
  fullWidth = true,
  submitButtonProps = {},
  cancelButtonProps = {},
  headerComponent,
  footerComponent,
  disableBackdropClick = false,
  disableEscapeKeyDown = false
}) => {
  const theme = useTheme();

  const handleClose = (event, reason) => {
    if (loading) return;
    if (disableBackdropClick && reason === 'backdropClick') return;
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return;
    onClose(event, reason);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || disabled) return;

    try {
      await onSubmit(event);
      if (!preventCloseOnSubmit) {
        onClose();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      {/* Loading Progress Bar */}
      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          position: 'relative'
        }}
      >
        {showCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={loading}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <DialogTitle
          sx={{
            p: 0,
            pr: showCloseButton ? 6 : 0,
            fontSize: '1.25rem',
            fontWeight: 600
          }}
        >
          {title}
        </DialogTitle>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}

        {headerComponent}
      </Box>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            p: 2,
            '&:first-of-type': {
              pt: 2
            }
          }}
        >
          {children}
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            gap: 1
          }}
        >
          {footerComponent}
          
          <Button
            onClick={onClose}
            disabled={loading}
            color="inherit"
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading || disabled}
            {...submitButtonProps}
          >
            {submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Preset configurations for common use cases
export const CreateFormDialog = (props) => (
  <FormDialog
    title={`Create ${props.itemName || 'Item'}`}
    submitText="Create"
    {...props}
  />
);

export const EditFormDialog = (props) => (
  <FormDialog
    title={`Edit ${props.itemName || 'Item'}`}
    submitText="Save Changes"
    {...props}
  />
);

export const ImportFormDialog = (props) => (
  <FormDialog
    title="Import Data"
    submitText="Import"
    maxWidth="md"
    {...props}
  />
);

export const ExportFormDialog = (props) => (
  <FormDialog
    title="Export Data"
    submitText="Export"
    maxWidth="sm"
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  const [open, setOpen] = useState(false);
  
  const handleSubmit = async (event) => {
    try {
      // Handle form submission
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CreateFormDialog
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
      itemName="User"
    >
      <TextField
        label="Name"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        type="email"
      />
    </CreateFormDialog>
  );
};
*/

export default FormDialog;
