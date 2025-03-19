import React from 'react';
import {
  Tooltip as MuiTooltip,
  Box,
  Typography,
  IconButton,
  useTheme,
  styled
} from '@mui/material';
import {
  Info as InfoIcon,
  Help as HelpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Styled tooltip with custom arrow
const StyledTooltip = styled(({ className, ...props }) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    maxWidth: 300,
    fontSize: theme.typography.body2.fontSize
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.background.paper
  }
}));

const Tooltip = ({
  title,
  description,
  type, // 'info', 'help', 'warning', 'error'
  icon,
  iconColor,
  placement = 'top',
  arrow = true,
  interactive = false,
  children,
  sx = {}
}) => {
  const theme = useTheme();

  // Get icon and color based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'info':
        return {
          icon: InfoIcon,
          color: theme.palette.info.main
        };
      case 'help':
        return {
          icon: HelpIcon,
          color: theme.palette.primary.main
        };
      case 'warning':
        return {
          icon: WarningIcon,
          color: theme.palette.warning.main
        };
      case 'error':
        return {
          icon: ErrorIcon,
          color: theme.palette.error.main
        };
      default:
        return {
          icon: InfoIcon,
          color: theme.palette.text.secondary
        };
    }
  };

  const typeConfig = getTypeConfig();
  const Icon = icon || typeConfig.icon;
  const color = iconColor || typeConfig.color;

  // Tooltip content
  const tooltipContent = (
    <Box sx={{ maxWidth: 250 }}>
      {title && (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: description ? 0.5 : 0,
            color: color
          }}
        >
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.5
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );

  // If children is provided, wrap it with tooltip
  if (children) {
    return (
      <StyledTooltip
        title={tooltipContent}
        placement={placement}
        arrow={arrow}
        interactive={interactive}
      >
        {children}
      </StyledTooltip>
    );
  }

  // Otherwise, render icon button with tooltip
  return (
    <StyledTooltip
      title={tooltipContent}
      placement={placement}
      arrow={arrow}
      interactive={interactive}
    >
      <IconButton
        size="small"
        sx={{
          color,
          p: 0.5,
          ...sx
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </StyledTooltip>
  );
};

// Preset configurations for common use cases
export const InfoTooltip = (props) => (
  <Tooltip type="info" {...props} />
);

export const HelpTooltip = (props) => (
  <Tooltip type="help" {...props} />
);

export const WarningTooltip = (props) => (
  <Tooltip type="warning" {...props} />
);

export const ErrorTooltip = (props) => (
  <Tooltip type="error" {...props} />
);

// Custom tooltips for specific use cases
export const SkillStatusTooltip = ({ status, children }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          title: 'Active Skill',
          description: 'This skill is currently active and accepting enrollments.',
          type: 'info'
        };
      case 'pending':
        return {
          title: 'Pending Approval',
          description: 'This skill is awaiting approval from the skill team.',
          type: 'warning'
        };
      case 'completed':
        return {
          title: 'Completed',
          description: 'This skill has been completed.',
          type: 'help'
        };
      case 'cancelled':
        return {
          title: 'Cancelled',
          description: 'This skill has been cancelled.',
          type: 'error'
        };
      default:
        return {
          title: 'Unknown Status',
          description: 'The status of this skill is unknown.',
          type: 'help'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tooltip
      title={config.title}
      description={config.description}
      type={config.type}
    >
      {children}
    </Tooltip>
  );
};

export const AssessmentTooltip = ({ assessment, children }) => {
  const getAssessmentInfo = () => {
    return {
      title: assessment.title,
      description: `Duration: ${assessment.duration} minutes
Questions: ${assessment.questionCount}
Passing Score: ${assessment.passingScore}%`,
      type: 'info'
    };
  };

  const info = getAssessmentInfo();

  return (
    <Tooltip
      title={info.title}
      description={info.description}
      type={info.type}
    >
      {children}
    </Tooltip>
  );
};

// Usage example:
/*
const MyComponent = () => {
  return (
    <Box>
      {/* Basic tooltip with icon */}
      <Tooltip
        title="Important Information"
        description="This is some important information that needs attention."
      />

      {/* Tooltip wrapping a component */}
      <Tooltip title="Click to edit">
        <IconButton>
          <EditIcon />
        </IconButton>
      </Tooltip>

      {/* Using preset configurations */}
      <InfoTooltip
        title="Info Tooltip"
        description="This is an informational tooltip."
      />

      {/* Custom tooltips for specific use cases */}
      <SkillStatusTooltip status="active">
        <StatusBadge status="active" />
      </SkillStatusTooltip>
    </Box>
  );
};
*/

export default Tooltip;
