import React from 'react';
import {
  Button,
  IconButton,
  CircularProgress,
  Box,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  Print as PrintIcon
} from '@mui/icons-material';

const CustomButton = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  loading = false,
  loadingPosition = 'start',
  iconOnly = false,
  rounded = false,
  children,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  // Loading indicator
  const loadingIndicator = (
    <CircularProgress
      size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
      color="inherit"
      sx={{
        position: 'absolute',
        left: loadingPosition === 'start' ? 14 : 'auto',
        right: loadingPosition === 'end' ? 14 : 'auto'
      }}
    />
  );

  if (iconOnly) {
    return (
      <IconButton
        color={color}
        size={size}
        disabled={loading || props.disabled}
        sx={{
          position: 'relative',
          borderRadius: rounded ? '50%' : 1,
          ...sx
        }}
        {...props}
      >
        {loading ? loadingIndicator : startIcon || children}
      </IconButton>
    );
  }

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={loadingPosition === 'start' ? null : startIcon}
      endIcon={loadingPosition === 'end' ? null : endIcon}
      disabled={loading || props.disabled}
      sx={{
        position: 'relative',
        borderRadius: rounded ? 20 : 1,
        textTransform: 'none',
        ...sx
      }}
      {...props}
    >
      {loading && loadingPosition === 'start' && loadingIndicator}
      {children}
      {loading && loadingPosition === 'end' && loadingIndicator}
    </Button>
  );
};

// Preset button configurations
export const AddButton = ({ children = 'Add New', ...props }) => (
  <CustomButton
    startIcon={<AddIcon />}
    color="primary"
    {...props}
  >
    {children}
  </CustomButton>
);

export const EditButton = ({ children = 'Edit', iconOnly, ...props }) => (
  <CustomButton
    startIcon={<EditIcon />}
    color="info"
    iconOnly={iconOnly}
    {...props}
  >
    {!iconOnly && children}
  </CustomButton>
);

export const DeleteButton = ({ children = 'Delete', iconOnly, ...props }) => (
  <CustomButton
    startIcon={<DeleteIcon />}
    color="error"
    iconOnly={iconOnly}
    {...props}
  >
    {!iconOnly && children}
  </CustomButton>
);

export const SaveButton = ({ children = 'Save', loading, ...props }) => (
  <CustomButton
    startIcon={<SaveIcon />}
    color="success"
    loading={loading}
    {...props}
  >
    {children}
  </CustomButton>
);

export const CancelButton = ({ children = 'Cancel', ...props }) => (
  <CustomButton
    startIcon={<CancelIcon />}
    color="inherit"
    variant="outlined"
    {...props}
  >
    {children}
  </CustomButton>
);

export const UploadButton = ({ children = 'Upload', loading, ...props }) => (
  <CustomButton
    startIcon={<UploadIcon />}
    loading={loading}
    {...props}
  >
    {children}
  </CustomButton>
);

export const DownloadButton = ({ children = 'Download', loading, ...props }) => (
  <CustomButton
    startIcon={<DownloadIcon />}
    loading={loading}
    {...props}
  >
    {children}
  </CustomButton>
);

export const RefreshButton = ({ children = 'Refresh', iconOnly, loading, ...props }) => (
  <CustomButton
    startIcon={<RefreshIcon />}
    color="inherit"
    iconOnly={iconOnly}
    loading={loading}
    {...props}
  >
    {!iconOnly && children}
  </CustomButton>
);

export const SendButton = ({ children = 'Send', loading, ...props }) => (
  <CustomButton
    endIcon={<SendIcon />}
    loadingPosition="end"
    loading={loading}
    {...props}
  >
    {children}
  </CustomButton>
);

export const PrintButton = ({ children = 'Print', iconOnly, ...props }) => (
  <CustomButton
    startIcon={<PrintIcon />}
    color="inherit"
    iconOnly={iconOnly}
    {...props}
  >
    {!iconOnly && children}
  </CustomButton>
);

// Button group component
export const ButtonGroup = ({
  children,
  spacing = 1,
  direction = 'row',
  align = 'center',
  justify = 'flex-start',
  sx = {}
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      gap: spacing,
      ...sx
    }}
  >
    {children}
  </Box>
);

// Usage example:
/*
const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ButtonGroup>
      <AddButton onClick={() => {}} />
      <EditButton iconOnly onClick={() => {}} />
      <SaveButton loading={loading} onClick={handleSave} />
      <DeleteButton
        variant="outlined"
        onClick={() => {}}
      />
      <RefreshButton
        iconOnly
        rounded
        onClick={() => {}}
      />
    </ButtonGroup>
  );
};
*/

export default CustomButton;
