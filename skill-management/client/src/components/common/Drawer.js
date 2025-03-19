import React from 'react';
import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const Drawer = ({
  open,
  onClose,
  anchor = 'right',
  width = 400,
  title,
  subtitle,
  children,
  footer,
  showCloseButton = true,
  collapsible = false,
  collapsed = false,
  onCollapse,
  elevation = 1,
  sx = {}
}) => {
  const theme = useTheme();

  // Get width based on screen size
  const getWidth = () => {
    if (typeof width === 'number') {
      return width;
    }
    return {
      xs: '100%',
      sm: width,
      ...width
    };
  };

  // Get content width based on collapsed state
  const getContentWidth = () => {
    if (!collapsible) return getWidth();
    return collapsed ? 64 : getWidth();
  };

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      variant="persistent"
      PaperProps={{
        elevation,
        sx: {
          width: getContentWidth(),
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          ...sx
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: 'background.default'
        }}
      >
        {(!collapsible || !collapsed) && (
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          {collapsible && (
            <IconButton
              onClick={onCollapse}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' }
              }}
            >
              {collapsed
                ? (anchor === 'right' ? <ChevronLeftIcon /> : <ChevronRightIcon />)
                : (anchor === 'right' ? <ChevronRightIcon /> : <ChevronLeftIcon />)
              }
            </IconButton>
          )}

          {showCloseButton && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' }
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: collapsed ? 1 : 2
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      {footer && !collapsed && (
        <>
          <Divider />
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default'
            }}
          >
            {footer}
          </Box>
        </>
      )}
    </MuiDrawer>
  );
};

// Preset configurations for common use cases
export const FilterDrawer = ({
  title = 'Filters',
  subtitle = 'Refine your results',
  width = 320,
  ...props
}) => (
  <Drawer
    title={title}
    subtitle={subtitle}
    width={width}
    anchor="right"
    {...props}
  />
);

export const DetailDrawer = ({
  title = 'Details',
  width = 400,
  collapsible = true,
  ...props
}) => (
  <Drawer
    title={title}
    width={width}
    collapsible={collapsible}
    anchor="right"
    {...props}
  />
);

export const NavigationDrawer = ({
  title = 'Navigation',
  width = 280,
  collapsible = true,
  ...props
}) => (
  <Drawer
    title={title}
    width={width}
    collapsible={collapsible}
    anchor="left"
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Drawer
      </Button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Drawer Title"
        subtitle="Drawer subtitle"
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        footer={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="contained">
              Save
            </Button>
          </Box>
        }
      >
        Drawer content
      </Drawer>
    </>
  );
};

// Using preset configurations
const MyComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <FilterDrawer
      open={open}
      onClose={() => setOpen(false)}
    >
      Filter content
    </FilterDrawer>
  );
};
*/

export default Drawer;
