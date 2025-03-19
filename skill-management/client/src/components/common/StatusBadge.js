import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Cancel as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Pending as PendingIcon,
  Block as BlockedIcon,
  HourglassEmpty as WaitingIcon,
  Done as CompletedIcon,
  Schedule as ScheduledIcon,
  PlayCircle as ActiveIcon
} from '@mui/icons-material';

const statusConfigs = {
  // Success states
  success: {
    icon: SuccessIcon,
    color: 'success.main',
    bgColor: 'success.lighter',
  },
  active: {
    icon: ActiveIcon,
    color: 'success.main',
    bgColor: 'success.lighter',
  },
  completed: {
    icon: CompletedIcon,
    color: 'success.main',
    bgColor: 'success.lighter',
  },
  approved: {
    icon: SuccessIcon,
    color: 'success.main',
    bgColor: 'success.lighter',
  },

  // Warning states
  warning: {
    icon: WarningIcon,
    color: 'warning.main',
    bgColor: 'warning.lighter',
  },
  pending: {
    icon: PendingIcon,
    color: 'warning.main',
    bgColor: 'warning.lighter',
  },
  waiting: {
    icon: WaitingIcon,
    color: 'warning.main',
    bgColor: 'warning.lighter',
  },
  scheduled: {
    icon: ScheduledIcon,
    color: 'warning.main',
    bgColor: 'warning.lighter',
  },

  // Error states
  error: {
    icon: ErrorIcon,
    color: 'error.main',
    bgColor: 'error.lighter',
  },
  rejected: {
    icon: BlockedIcon,
    color: 'error.main',
    bgColor: 'error.lighter',
  },
  blocked: {
    icon: BlockedIcon,
    color: 'error.main',
    bgColor: 'error.lighter',
  },
  failed: {
    icon: ErrorIcon,
    color: 'error.main',
    bgColor: 'error.lighter',
  },

  // Info states
  info: {
    icon: InfoIcon,
    color: 'info.main',
    bgColor: 'info.lighter',
  },
  draft: {
    icon: InfoIcon,
    color: 'info.main',
    bgColor: 'info.lighter',
  },
  inProgress: {
    icon: PendingIcon,
    color: 'info.main',
    bgColor: 'info.lighter',
  },

  // Default state
  default: {
    icon: InfoIcon,
    color: 'grey.500',
    bgColor: 'grey.100',
  }
};

const StatusBadge = ({
  status,
  customConfig,
  showIcon = true,
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'contained', // 'contained', 'outlined'
  sx = {}
}) => {
  const theme = useTheme();
  
  // Convert status to lowercase and remove spaces for matching
  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '') || 'default';
  
  // Get config based on status or use custom config
  const config = customConfig || statusConfigs[normalizedStatus] || statusConfigs.default;
  
  // Get size configurations
  const sizeConfigs = {
    small: {
      px: 1,
      py: 0.25,
      fontSize: '0.75rem',
      iconSize: 16,
    },
    medium: {
      px: 1.5,
      py: 0.5,
      fontSize: '0.875rem',
      iconSize: 20,
    },
    large: {
      px: 2,
      py: 0.75,
      fontSize: '1rem',
      iconSize: 24,
    }
  };

  const sizeConfig = sizeConfigs[size] || sizeConfigs.medium;
  const Icon = config.icon;

  // Style based on variant
  const variantStyles = variant === 'outlined' ? {
    backgroundColor: 'transparent',
    border: 1,
    borderColor: config.color,
  } : {
    backgroundColor: config.bgColor,
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '16px',
        ...variantStyles,
        ...sizeConfig,
        ...sx
      }}
    >
      {showIcon && (
        <Icon
          sx={{
            width: sizeConfig.iconSize,
            height: sizeConfig.iconSize,
            color: config.color,
            mr: 0.5
          }}
        />
      )}
      <Typography
        variant="body2"
        sx={{
          color: config.color,
          fontWeight: 500,
          fontSize: sizeConfig.fontSize,
          lineHeight: 1,
          textTransform: 'capitalize'
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};

// Preset configurations for common use cases
export const SkillStatusBadge = ({ status, ...props }) => (
  <StatusBadge
    status={status}
    customConfig={
      status === 'daySkill' ? {
        icon: WaitingIcon,
        color: 'primary.main',
        bgColor: 'primary.lighter',
      } :
      status === 'nightSkill' ? {
        icon: WaitingIcon,
        color: 'secondary.main',
        bgColor: 'secondary.lighter',
      } : undefined
    }
    {...props}
  />
);

export const AssessmentStatusBadge = ({ status, ...props }) => (
  <StatusBadge
    status={status}
    customConfig={
      status === 'upcoming' ? {
        icon: ScheduledIcon,
        color: 'info.main',
        bgColor: 'info.lighter',
      } :
      status === 'inProgress' ? {
        icon: ActiveIcon,
        color: 'warning.main',
        bgColor: 'warning.lighter',
      } : undefined
    }
    {...props}
  />
);

export const BudgetStatusBadge = ({ status, ...props }) => (
  <StatusBadge
    status={status}
    customConfig={
      status === 'underReview' ? {
        icon: PendingIcon,
        color: 'info.main',
        bgColor: 'info.lighter',
      } : undefined
    }
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  return (
    <Box>
      <StatusBadge status="active" />
      <StatusBadge status="pending" variant="outlined" />
      <StatusBadge status="rejected" size="large" />
      <SkillStatusBadge status="daySkill" />
      <AssessmentStatusBadge status="upcoming" />
      <BudgetStatusBadge status="underReview" />
    </Box>
  );
};
*/

export default StatusBadge;
