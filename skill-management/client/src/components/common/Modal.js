import React from 'react';
import {
  Modal as MuiModal,
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
  Backdrop,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  WarningAmber as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  type, // 'success', 'error', 'warning', 'info'
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  sx = {}
}) => {
  const theme = useTheme();

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (disableBackdropClick) {
      event.stopPropagation();
      return;
    }
    onClose?.(event, 'backdropClick');
  };

  // Get icon and color based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: SuccessIcon,
          color: theme.palette.success.main,
          bgColor: theme.palette.success.lighter
        };
      case 'error':
        return {
          icon: ErrorIcon,
          color: theme.palette.error.main,
          bgColor: theme.palette.error.lighter
        };
      case 'warning':
        return {
          icon: WarningIcon,
          color: theme.palette.warning.main,
          bgColor: theme.palette.warning.lighter
        };
      case 'info':
        return {
          icon: InfoIcon,
          color: theme.palette.info.main,
          bgColor: theme.palette.info.lighter
        };
      default:
        return null;
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableEscapeKeyDown={disableEscapeKeyDown}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        onClick: handleBackdropClick
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: fullWidth ? {
              xs: '90%',
              sm: maxWidth === 'xs' ? '444px' : '600px',
              md: maxWidth === 'xs' ? '444px' : maxWidth === 'sm' ? '600px' : '900px',
              lg: maxWidth === 'xs' ? '444px' : maxWidth === 'sm' ? '600px' : maxWidth === 'md' ? '900px' : '1200px'
            } : 'auto',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            ...sx
          }}
        >
          <Paper
            elevation={24}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: typeConfig?.bgColor
              }}
            >
              {typeConfig && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mr: 2
                  }}
                >
                  <typeConfig.icon
                    sx={{
                      fontSize: 28,
                      color: typeConfig.color
                    }}
                  />
                </Box>
              )}
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: typeConfig?.color || 'text.primary'
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {showCloseButton && (
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    ml: 2,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>

            {/* Content */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 3
              }}
            >
              {children}
            </Box>

            {/* Footer */}
            {footer && (
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.default'
                }}
              >
                {footer}
              </Box>
            )}
          </Paper>
        </Box>
      </Fade>
    </MuiModal>
  );
};

// Preset configurations for common use cases
export const SuccessModal = (props) => (
  <Modal type="success" {...props} />
);

export const ErrorModal = (props) => (
  <Modal type="error" {...props} />
);

export const WarningModal = (props) => (
  <Modal
    type="warning"
    disableBackdropClick
    {...props}
  />
);

export const InfoModal = (props) => (
  <Modal type="info" {...props} />
);

// Usage example:
/*
const MyComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Modal
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Title"
        subtitle="Modal subtitle"
        footer={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </Box>
        }
      >
        <Typography>
          Modal content goes here
        </Typography>
      </Modal>
    </>
  );
};

// Using preset configurations
const MyComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <SuccessModal
      open={open}
      onClose={() => setOpen(false)}
      title="Success!"
      subtitle="Operation completed successfully"
    >
      Success content
    </SuccessModal>
  );
};
*/

export default Modal;
