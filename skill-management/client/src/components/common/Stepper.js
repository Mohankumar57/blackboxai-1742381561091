import React from 'react';
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  Box,
  Button,
  Typography,
  useTheme,
  styled
} from '@mui/material';
import {
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Styled components
const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontSize: '0.875rem',
    '&.Mui-active': {
      fontWeight: 600,
      color: theme.palette.primary.main
    },
    '&.Mui-completed': {
      fontWeight: 500,
      color: theme.palette.success.main
    }
  }
}));

const StyledStepContent = styled(StepContent)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  borderLeft: `1px solid ${theme.palette.divider}`
}));

const Stepper = ({
  steps,
  activeStep,
  onStepChange,
  orientation = 'vertical',
  variant = 'standard', // 'standard', 'outlined', 'contained'
  alternativeLabel = false,
  showContent = true,
  nonLinear = false,
  showNavigation = true,
  navigationPosition = 'bottom', // 'top', 'bottom', 'both'
  sx = {}
}) => {
  const theme = useTheme();

  // Handle step click
  const handleStep = (step) => {
    if (nonLinear) {
      onStepChange(step);
    }
  };

  // Handle next step
  const handleNext = () => {
    onStepChange(activeStep + 1);
  };

  // Handle previous step
  const handleBack = () => {
    onStepChange(activeStep - 1);
  };

  // Navigation buttons
  const NavigationButtons = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1,
        mt: 2
      }}
    >
      <Button
        disabled={activeStep === 0}
        onClick={handleBack}
        variant="outlined"
      >
        Back
      </Button>
      <Button
        variant="contained"
        onClick={handleNext}
        disabled={activeStep === steps.length - 1}
      >
        Next
      </Button>
    </Box>
  );

  // Get step icon
  const StepIcon = ({ active, completed, error }) => {
    if (error) {
      return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
    }
    if (completed) {
      return <CheckIcon sx={{ color: theme.palette.success.main }} />;
    }
    if (active) {
      return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
    }
    return null;
  };

  return (
    <Box sx={sx}>
      {/* Top Navigation */}
      {showNavigation && navigationPosition !== 'bottom' && <NavigationButtons />}

      {/* Stepper */}
      <MuiStepper
        activeStep={activeStep}
        orientation={orientation}
        alternativeLabel={alternativeLabel}
        nonLinear={nonLinear}
        sx={{ mt: 2 }}
      >
        {steps.map((step, index) => (
          <Step
            key={step.label}
            completed={step.completed || (nonLinear ? step.completed : index < activeStep)}
            disabled={step.disabled}
          >
            {nonLinear ? (
              <StepButton onClick={() => handleStep(index)}>
                <StyledStepLabel
                  StepIconComponent={(props) => (
                    <StepIcon {...props} error={step.error} />
                  )}
                  optional={
                    step.optional && (
                      <Typography variant="caption" color="text.secondary">
                        {step.optional}
                      </Typography>
                    )
                  }
                >
                  {step.label}
                </StyledStepLabel>
              </StepButton>
            ) : (
              <StyledStepLabel
                StepIconComponent={(props) => (
                  <StepIcon {...props} error={step.error} />
                )}
                optional={
                  step.optional && (
                    <Typography variant="caption" color="text.secondary">
                      {step.optional}
                    </Typography>
                  )
                }
              >
                {step.label}
              </StyledStepLabel>
            )}
            {showContent && orientation === 'vertical' && (
              <StyledStepContent>
                {step.content}
                {!showNavigation && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                )}
              </StyledStepContent>
            )}
          </Step>
        ))}
      </MuiStepper>

      {/* Bottom Navigation */}
      {showNavigation && navigationPosition !== 'top' && <NavigationButtons />}

      {/* Horizontal Content */}
      {showContent && orientation === 'horizontal' && activeStep < steps.length && (
        <Box sx={{ mt: 2 }}>
          {steps[activeStep].content}
        </Box>
      )}
    </Box>
  );
};

// Preset configurations for common use cases
export const SkillCreationStepper = ({ onStepChange, activeStep, ...props }) => {
  const steps = [
    {
      label: 'Basic Information',
      content: 'Basic information content',
      optional: 'Fill in basic details'
    },
    {
      label: 'Schedule',
      content: 'Schedule content',
      optional: 'Set dates and times'
    },
    {
      label: 'Requirements',
      content: 'Requirements content',
      optional: 'Define prerequisites'
    },
    {
      label: 'Review',
      content: 'Review content'
    }
  ];

  return (
    <Stepper
      steps={steps}
      activeStep={activeStep}
      onStepChange={onStepChange}
      {...props}
    />
  );
};

export const AssessmentCreationStepper = ({ onStepChange, activeStep, ...props }) => {
  const steps = [
    {
      label: 'Assessment Details',
      content: 'Assessment details content',
      optional: 'Basic settings'
    },
    {
      label: 'Questions',
      content: 'Questions content',
      optional: 'Add questions'
    },
    {
      label: 'Settings',
      content: 'Settings content',
      optional: 'Configure rules'
    },
    {
      label: 'Preview',
      content: 'Preview content'
    }
  ];

  return (
    <Stepper
      steps={steps}
      activeStep={activeStep}
      onStepChange={onStepChange}
      {...props}
    />
  );
};

// Usage example:
/*
const MyComponent = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'Step 1',
      content: 'Step 1 content',
      optional: 'Optional text'
    },
    {
      label: 'Step 2',
      content: 'Step 2 content',
      error: true
    },
    {
      label: 'Step 3',
      content: 'Step 3 content',
      completed: true
    }
  ];

  return (
    <Stepper
      steps={steps}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      orientation="vertical"
      showNavigation
    />
  );
};

// Using preset configurations
const MyComponent = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <SkillCreationStepper
      activeStep={activeStep}
      onStepChange={setActiveStep}
    />
  );
};
*/

export default Stepper;
