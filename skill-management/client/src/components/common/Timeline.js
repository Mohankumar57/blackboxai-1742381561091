import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  styled
} from '@mui/material';
import {
  Timeline as MuiTimeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Event as EventIcon,
  School as SkillIcon,
  Assignment as AssessmentIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Schedule as PendingIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Styled components
const StyledTimelineItem = styled(TimelineItem)(({ theme }) => ({
  '&:before': {
    flex: 0,
    padding: 0
  }
}));

const StyledTimelineContent = styled(TimelineContent)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2)
}));

const Timeline = ({
  items = [],
  showOppositeContent = true,
  alternateContent = false,
  loading = false,
  error = false,
  onItemClick,
  onMoreClick,
  emptyMessage = 'No timeline items',
  sx = {}
}) => {
  const theme = useTheme();

  // Get icon based on type
  const getIcon = (type) => {
    switch (type) {
      case 'skill':
        return <SkillIcon />;
      case 'assessment':
        return <AssessmentIcon />;
      case 'completed':
        return <CompletedIcon />;
      case 'cancelled':
        return <CancelledIcon />;
      case 'pending':
        return <PendingIcon />;
      default:
        return <EventIcon />;
    }
  };

  // Get color based on type
  const getColor = (type) => {
    switch (type) {
      case 'skill':
        return theme.palette.primary.main;
      case 'assessment':
        return theme.palette.secondary.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'pending':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  // Loading or error state
  if (loading || error || items.length === 0) {
    return (
      <Card sx={sx}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {loading ? 'Loading...' : error ? 'Error loading timeline' : emptyMessage}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <MuiTimeline
          position={alternateContent ? 'alternate' : 'right'}
          sx={{ px: 0 }}
        >
          {items.map((item, index) => (
            <StyledTimelineItem key={item.id || index}>
              {/* Opposite Content (Date) */}
              {showOppositeContent && (
                <TimelineOppositeContent
                  sx={{
                    flex: 0.2,
                    py: '20px'
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatDate(item.date)}
                  </Typography>
                </TimelineOppositeContent>
              )}

              {/* Timeline Separator */}
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: getColor(item.type),
                    boxShadow: theme.shadows[3]
                  }}
                >
                  {getIcon(item.type)}
                </TimelineDot>
                {index < items.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: 'divider' }} />
                )}
              </TimelineSeparator>

              {/* Timeline Content */}
              <StyledTimelineContent
                onClick={() => onItemClick?.(item)}
                sx={{
                  cursor: onItemClick ? 'pointer' : 'default',
                  '&:hover': onItemClick ? {
                    bgcolor: 'action.hover'
                  } : {}
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    {item.subtitle && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {item.subtitle}
                      </Typography>
                    )}
                    {item.description && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                  {onMoreClick && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoreClick(item);
                      }}
                    >
                      <MoreIcon />
                    </IconButton>
                  )}
                </Box>
              </StyledTimelineContent>
            </StyledTimelineItem>
          ))}
        </MuiTimeline>
      </CardContent>
    </Card>
  );
};

// Preset configurations for common use cases
export const SkillTimeline = ({ skills = [], ...props }) => {
  const items = skills.map(skill => ({
    ...skill,
    type: 'skill',
    subtitle: `${skill.type} • ${skill.duration}`,
    description: skill.description
  }));

  return (
    <Timeline
      items={items}
      {...props}
    />
  );
};

export const AssessmentTimeline = ({ assessments = [], ...props }) => {
  const items = assessments.map(assessment => ({
    ...assessment,
    type: 'assessment',
    subtitle: `Duration: ${assessment.duration} minutes`,
    description: `Questions: ${assessment.questionCount} • Passing Score: ${assessment.passingScore}%`
  }));

  return (
    <Timeline
      items={items}
      {...props}
    />
  );
};

// Usage example:
/*
const MyComponent = () => {
  const items = [
    {
      id: 1,
      type: 'skill',
      date: new Date(),
      title: 'React Fundamentals',
      subtitle: 'Technical Skill',
      description: 'Learn React basics and core concepts'
    },
    {
      id: 2,
      type: 'assessment',
      date: new Date(),
      title: 'React Assessment',
      subtitle: '60 minutes',
      description: '30 questions'
    }
  ];

  return (
    <Timeline
      items={items}
      onItemClick={(item) => console.log('Item clicked:', item)}
      onMoreClick={(item) => console.log('More clicked:', item)}
    />
  );
};

// Using preset configurations
const MyComponent = () => {
  const skills = [
    {
      id: 1,
      date: new Date(),
      title: 'React Basics',
      type: 'daySkill',
      duration: '8 weeks',
      description: 'Learn React fundamentals'
    }
  ];

  return (
    <SkillTimeline
      skills={skills}
      onItemClick={(skill) => console.log('Skill clicked:', skill)}
    />
  );
};
*/

export default Timeline;
