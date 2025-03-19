import React from 'react';
import {
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Box,
  useTheme,
  styled
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  Block as BlockIcon
} from '@mui/icons-material';

// Styled MenuItem with hover effect
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  minHeight: 'auto',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const Menu = ({
  anchorEl,
  open,
  onClose,
  items = [],
  width = 200,
  placement = {
    vertical: 'bottom',
    horizontal: 'right'
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'right'
  }
}) => {
  const theme = useTheme();

  return (
    <MuiMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={placement}
      transformOrigin={transformOrigin}
      PaperProps={{
        elevation: 3,
        sx: {
          width,
          maxHeight: 300,
          overflow: 'auto',
          mt: 1,
          '& .MuiList-root': {
            py: 1
          }
        }
      }}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return <Divider key={index} sx={{ my: 1 }} />;
        }

        if (item.header) {
          return (
            <Typography
              key={index}
              variant="caption"
              sx={{
                px: 2,
                py: 0.5,
                display: 'block',
                color: 'text.secondary'
              }}
            >
              {item.header}
            </Typography>
          );
        }

        return (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
            disabled={item.disabled}
            sx={item.sx}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  color: item.color || 'inherit',
                  minWidth: 36
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    color: item.color || 'text.primary',
                    fontWeight: item.bold ? 600 : 400
                  }}
                >
                  {item.label}
                </Typography>
              }
              secondary={item.description && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    mt: 0.25
                  }}
                >
                  {item.description}
                </Typography>
              )}
            />
          </MenuItem>
        );
      })}
    </MuiMenu>
  );
};

// Menu trigger component
export const MenuTrigger = ({ onClick, size = 'small', color = 'inherit', sx = {} }) => (
  <IconButton
    size={size}
    color={color}
    onClick={onClick}
    sx={sx}
  >
    <MoreIcon />
  </IconButton>
);

// Preset menu configurations
export const SkillMenu = ({ onEdit, onDelete, onCopy, onArchive, onShare }) => {
  const items = [
    {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      onClick: onEdit
    },
    {
      label: 'Copy',
      icon: <CopyIcon fontSize="small" />,
      onClick: onCopy
    },
    {
      label: 'Share',
      icon: <ShareIcon fontSize="small" />,
      onClick: onShare
    },
    { divider: true },
    {
      label: 'Archive',
      icon: <ArchiveIcon fontSize="small" />,
      onClick: onArchive,
      color: 'warning.main'
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      onClick: onDelete,
      color: 'error.main'
    }
  ];

  return { items };
};

export const AssessmentMenu = ({ onEdit, onDelete, onDownload, onBlock }) => {
  const items = [
    {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      onClick: onEdit
    },
    {
      label: 'Download Results',
      icon: <DownloadIcon fontSize="small" />,
      onClick: onDownload
    },
    { divider: true },
    {
      label: 'Block Submissions',
      icon: <BlockIcon fontSize="small" />,
      onClick: onBlock,
      color: 'warning.main'
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      onClick: onDelete,
      color: 'error.main'
    }
  ];

  return { items };
};

// Usage example:
/*
const MyComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Basic menu
  const menuItems = [
    {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      onClick: () => console.log('Edit clicked')
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      onClick: () => console.log('Delete clicked'),
      color: 'error.main'
    }
  ];

  // Using preset configurations
  const { items: skillMenuItems } = SkillMenu({
    onEdit: () => console.log('Edit skill'),
    onDelete: () => console.log('Delete skill')
  });

  return (
    <>
      <MenuTrigger onClick={handleClick} />
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        items={menuItems}
      />
    </>
  );
};
*/

export default Menu;
