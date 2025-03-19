import React from 'react';
import {
  Avatar,
  Badge,
  Tooltip,
  Box,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  School as StudentIcon,
  LocalLibrary as FacultyIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as VerifiedIcon
} from '@mui/icons-material';

const ProfileAvatar = ({
  user,
  size = 'medium', // 'small', 'medium', 'large'
  showBadge = true,
  showVerified = true,
  showTooltip = true,
  onClick,
  sx = {}
}) => {
  const theme = useTheme();

  // Get size configurations
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          avatar: 32,
          badge: 12,
          icon: 20
        };
      case 'large':
        return {
          avatar: 64,
          badge: 20,
          icon: 32
        };
      default: // medium
        return {
          avatar: 40,
          badge: 16,
          icon: 24
        };
    }
  };

  const sizeConfig = getSizeConfig();

  // Get role icon and color
  const getRoleConfig = () => {
    switch (user?.role) {
      case 'student':
        return {
          icon: StudentIcon,
          color: theme.palette.info.main,
          label: 'Student'
        };
      case 'faculty':
        return {
          icon: FacultyIcon,
          color: theme.palette.success.main,
          label: 'Faculty'
        };
      case 'skillTeam':
        return {
          icon: AdminIcon,
          color: theme.palette.warning.main,
          label: 'Skill Team'
        };
      default:
        return {
          icon: PersonIcon,
          color: theme.palette.grey[500],
          label: 'User'
        };
    }
  };

  const roleConfig = getRoleConfig();
  const RoleIcon = roleConfig.icon;

  // Generate initials from name
  const getInitials = () => {
    if (!user?.name) return '';
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get tooltip content
  const getTooltipContent = () => {
    let content = user?.name || 'Unknown User';
    if (user?.role) {
      content += ` • ${roleConfig.label}`;
    }
    if (user?.department) {
      content += ` • ${user.department}`;
    }
    return content;
  };

  const avatar = (
    <Avatar
      src={user?.avatar}
      alt={user?.name}
      sx={{
        width: sizeConfig.avatar,
        height: sizeConfig.avatar,
        bgcolor: user?.avatar ? 'transparent' : roleConfig.color,
        cursor: onClick ? 'pointer' : 'default',
        ...sx
      }}
      onClick={onClick}
    >
      {!user?.avatar && getInitials()}
    </Avatar>
  );

  const badgedAvatar = showBadge ? (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      badgeContent={
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '50%',
            padding: 0.25
          }}
        >
          <RoleIcon
            sx={{
              width: sizeConfig.badge,
              height: sizeConfig.badge,
              color: roleConfig.color
            }}
          />
        </Box>
      }
    >
      {showVerified && user?.verified ? (
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          badgeContent={
            <VerifiedIcon
              sx={{
                width: sizeConfig.badge,
                height: sizeConfig.badge,
                color: theme.palette.primary.main,
                bgcolor: 'background.paper',
                borderRadius: '50%'
              }}
            />
          }
        >
          {avatar}
        </Badge>
      ) : (
        avatar
      )}
    </Badge>
  ) : (
    avatar
  );

  return showTooltip ? (
    <Tooltip title={getTooltipContent()} arrow>
      {badgedAvatar}
    </Tooltip>
  ) : (
    badgedAvatar
  );
};

// Preset configurations for common use cases
export const StudentAvatar = (props) => (
  <ProfileAvatar
    {...props}
    user={{ ...props.user, role: 'student' }}
  />
);

export const FacultyAvatar = (props) => (
  <ProfileAvatar
    {...props}
    user={{ ...props.user, role: 'faculty' }}
  />
);

export const TeamAvatar = (props) => (
  <ProfileAvatar
    {...props}
    user={{ ...props.user, role: 'skillTeam' }}
  />
);

// Group avatar component
export const GroupAvatars = ({
  users = [],
  max = 3,
  size = 'medium',
  spacing = 1,
  sx = {}
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...sx
      }}
    >
      {visibleUsers.map((user, index) => (
        <Box
          key={user.id || index}
          sx={{
            ml: index === 0 ? 0 : -spacing,
            border: 2,
            borderColor: 'background.paper',
            borderRadius: '50%'
          }}
        >
          <ProfileAvatar
            user={user}
            size={size}
            showBadge={false}
            showTooltip={true}
          />
        </Box>
      ))}
      {remainingCount > 0 && (
        <Avatar
          sx={{
            ml: -spacing,
            border: 2,
            borderColor: 'background.paper',
            bgcolor: 'action.selected',
            color: 'text.secondary',
            ...getSizeStyles(size)
          }}
        >
          +{remainingCount}
        </Avatar>
      )}
    </Box>
  );
};

// Helper function for group avatar sizes
const getSizeStyles = (size) => {
  switch (size) {
    case 'small':
      return { width: 32, height: 32, fontSize: '0.75rem' };
    case 'large':
      return { width: 64, height: 64, fontSize: '1.25rem' };
    default:
      return { width: 40, height: 40, fontSize: '0.875rem' };
  }
};

// Usage example:
/*
// Basic usage
const MyComponent = () => {
  const user = {
    name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
    verified: true
  };

  return <ProfileAvatar user={user} />;
};

// Group avatars
const MyComponent = () => {
  const users = [
    { name: 'John Doe', role: 'student' },
    { name: 'Jane Smith', role: 'faculty' },
    { name: 'Bob Johnson', role: 'student' },
    { name: 'Alice Brown', role: 'student' }
  ];

  return <GroupAvatars users={users} max={3} />;
};
*/

export default ProfileAvatar;
