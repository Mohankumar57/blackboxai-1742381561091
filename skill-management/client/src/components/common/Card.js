import React from 'react';
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Collapse,
  Divider,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const Card = ({
  title,
  subtitle,
  headerAction,
  media,
  mediaHeight = 200,
  content,
  actions,
  expandable = false,
  expanded = false,
  onExpandChange,
  expandedContent,
  elevation = 1,
  sx = {}
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  const handleExpandClick = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  return (
    <MuiCard
      elevation={elevation}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        ...sx
      }}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <CardHeader
          title={
            title && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )
          }
          subheader={
            subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )
          }
          action={
            headerAction || (
              expandable && (
                <IconButton
                  onClick={handleExpandClick}
                  sx={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: theme.transitions.create('transform')
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              )
            )
          }
          sx={{
            p: 2,
            '& .MuiCardHeader-content': {
              overflow: 'hidden'
            }
          }}
        />
      )}

      {/* Card Media */}
      {media && (
        <CardMedia
          component="img"
          height={mediaHeight}
          image={media}
          alt={title}
          sx={{
            objectFit: 'cover'
          }}
        />
      )}

      {/* Card Content */}
      <CardContent
        sx={{
          flex: 1,
          p: 2,
          '&:last-child': {
            pb: actions ? 0 : 2
          }
        }}
      >
        {content}
      </CardContent>

      {/* Expandable Content */}
      {expandable && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent sx={{ p: 2 }}>
            {expandedContent}
          </CardContent>
        </Collapse>
      )}

      {/* Card Actions */}
      {actions && (
        <>
          <Divider />
          <CardActions sx={{ p: 2 }}>
            {actions}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
};

// Preset card configurations
export const SkillCard = ({
  skill,
  onEdit,
  onDelete,
  onEnroll,
  ...props
}) => {
  const actions = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box>
        {onEdit && (
          <IconButton onClick={onEdit} size="small">
            <EditIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton onClick={onDelete} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      {onEnroll && (
        <Button
          variant="contained"
          size="small"
          onClick={onEnroll}
        >
          Enroll Now
        </Button>
      )}
    </Box>
  );

  return (
    <Card
      title={skill.name}
      subtitle={`${skill.type} • ${skill.duration}`}
      content={
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {skill.description}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <StatusBadge status={skill.status} />
            <Typography variant="caption" color="text.secondary">
              {skill.enrolledCount} students enrolled
            </Typography>
          </Box>
        </Box>
      }
      actions={actions}
      {...props}
    />
  );
};

export const AssessmentCard = ({
  assessment,
  onStart,
  onView,
  ...props
}) => {
  const actions = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      <Button
        variant="contained"
        size="small"
        onClick={onStart || onView}
      >
        {onStart ? 'Start Assessment' : 'View Results'}
      </Button>
    </Box>
  );

  return (
    <Card
      title={assessment.title}
      subtitle={`Duration: ${assessment.duration} minutes`}
      content={
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {assessment.description}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <StatusBadge status={assessment.status} />
            <Typography variant="caption" color="text.secondary">
              {assessment.questionCount} questions
            </Typography>
          </Box>
        </Box>
      }
      actions={actions}
      {...props}
    />
  );
};

// Usage example:
/*
const MyComponent = () => {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
      <Card
        title="Basic Card"
        subtitle="Card subtitle"
        content={<Typography>Card content</Typography>}
        actions={<Button>Action</Button>}
      />

      <Card
        title="Expandable Card"
        content={<Typography>Main content</Typography>}
        expandable
        expandedContent={<Typography>Expanded content</Typography>}
      />

      <SkillCard
        skill={{
          name: 'React Development',
          type: 'Technical',
          duration: '8 weeks',
          description: 'Learn React from basics to advanced',
          status: 'active',
          enrolledCount: 45
        }}
        onEdit={() => {}}
        onEnroll={() => {}}
      />
    </Box>
  );
};
*/

export default Card;
