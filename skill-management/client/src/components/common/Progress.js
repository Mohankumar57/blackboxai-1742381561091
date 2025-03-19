import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
  styled
} from '@mui/material';

// Styled components
const CircularProgressWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex'
}));

const CircularProgressLabel = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const LinearProgressWrapper = styled(Box)(({ theme }) => ({
  width: '100%'
}));

const Progress = ({
  variant = 'linear', // 'linear', 'circular', 'steps'
  value = 0,
  total = 100,
  size = 'medium', // 'small', 'medium', 'large'
  showLabel = true,
  labelVariant = 'percentage', // 'percentage', 'fraction', 'custom'
  customLabel,
  color = 'primary',
  thickness = 4,
  animation = true,
  steps = [],
  sx = {}
}) => {
  const theme = useTheme();

  // Calculate percentage
  const percentage = Math.round((value / total) * 100);

  // Get size configuration
  const getSize = () => {
    switch (size) {
      case 'small':
        return { size: 40, fontSize: '0.875rem' };
      case 'large':
        return { size: 80, fontSize: '1.25rem' };
      default:
        return { size: 60, fontSize: '1rem' };
    }
  };

  // Get label text
  const getLabel = () => {
    switch (labelVariant) {
      case 'percentage':
        return `${percentage}%`;
      case 'fraction':
        return `${value}/${total}`;
      case 'custom':
        return customLabel;
      default:
        return `${percentage}%`;
    }
  };

  // Get color based on percentage
  const getColor = () => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    if (percentage >= 40) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  // Render circular progress
  const renderCircular = () => (
    <CircularProgressWrapper sx={sx}>
      <CircularProgress
        variant={animation ? 'indeterminate' : 'determinate'}
        value={percentage}
        size={getSize().size}
        thickness={thickness}
        sx={{
          color: getColor(),
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round'
          }
        }}
      />
      {showLabel && (
        <CircularProgressLabel>
          <Typography
            variant="body2"
            component="div"
            sx={{
              fontSize: getSize().fontSize,
              fontWeight: 500
            }}
          >
            {getLabel()}
          </Typography>
        </CircularProgressLabel>
      )}
    </CircularProgressWrapper>
  );

  // Render linear progress
  const renderLinear = () => (
    <LinearProgressWrapper sx={sx}>
      <LinearProgress
        variant={animation ? 'indeterminate' : 'determinate'}
        value={percentage}
        sx={{
          height: size === 'small' ? 4 : size === 'large' ? 8 : 6,
          borderRadius: 5,
          bgcolor: theme.palette.action.hover,
          '& .MuiLinearProgress-bar': {
            bgcolor: getColor(),
            borderRadius: 5
          }
        }}
      />
      {showLabel && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {getLabel()}
          </Typography>
          {labelVariant === 'fraction' && (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Total: {total}
            </Typography>
          )}
        </Box>
      )}
    </LinearProgressWrapper>
  );

  // Render steps progress
  const renderSteps = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        ...sx
      }}
    >
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Box
            sx={{
              flex: 1,
              position: 'relative'
            }}
          >
            <LinearProgress
              variant="determinate"
              value={index < value ? 100 : index === value ? percentage : 0}
              sx={{
                height: size === 'small' ? 4 : size === 'large' ? 8 : 6,
                borderRadius: 5,
                bgcolor: theme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  bgcolor: getColor(),
                  borderRadius: 5
                }
              }}
            />
            {showLabel && (
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  mt: 1,
                  color: 'text.secondary'
                }}
              >
                {step}
              </Typography>
            )}
          </Box>
          {index < steps.length - 1 && (
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: index < value ? getColor() : theme.palette.action.hover,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              {index + 1}
            </Box>
          )}
        </React.Fragment>
      ))}
    </Box>
  );

  // Render based on variant
  switch (variant) {
    case 'circular':
      return renderCircular();
    case 'steps':
      return renderSteps();
    default:
      return renderLinear();
  }
};

// Preset configurations for common use cases
export const SkillProgress = ({ completed, total, ...props }) => (
  <Progress
    value={completed}
    total={total}
    labelVariant="fraction"
    customLabel={`${completed} of ${total} completed`}
    {...props}
  />
);

export const AssessmentProgress = ({ score, passingScore = 70, ...props }) => (
  <Progress
    variant="circular"
    value={score}
    total={100}
    customLabel={`${score}%`}
    color={score >= passingScore ? 'success' : 'error'}
    {...props}
  />
);

export const StepProgress = ({ currentStep, steps, ...props }) => (
  <Progress
    variant="steps"
    value={currentStep}
    total={steps.length}
    steps={steps}
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Progress
        value={75}
        total={100}
      />

      <Progress
        variant="circular"
        value={75}
        total={100}
        size="large"
      />

      <Progress
        variant="steps"
        value={2}
        total={4}
        steps={['Step 1', 'Step 2', 'Step 3', 'Step 4']}
      />

      <SkillProgress
        completed={3}
        total={5}
      />

      <AssessmentProgress
        score={85}
        passingScore={70}
      />

      <StepProgress
        currentStep={1}
        steps={['Basic', 'Intermediate', 'Advanced']}
      />
    </Box>
  );
};
*/

export default Progress;
