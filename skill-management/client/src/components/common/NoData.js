import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import {
  SearchOff as NoSearchResultIcon,
  DataArray as NoDataIcon,
  Error as ErrorIcon,
  Add as AddIcon
} from '@mui/icons-material';

const NoData = ({
  type = 'default', // 'default', 'search', 'error', 'filtered'
  title,
  message,
  actionLabel,
  onActionClick,
  icon: CustomIcon,
  showAction = true,
  minHeight = 400,
  sx = {}
}) => {
  const theme = useTheme();

  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: NoSearchResultIcon,
          title: 'No Results Found',
          message: 'Try adjusting your search criteria',
          actionLabel: 'Clear Search'
        };
      case 'error':
        return {
          icon: ErrorIcon,
          title: 'Error Loading Data',
          message: 'An error occurred while loading the data',
          actionLabel: 'Try Again'
        };
      case 'filtered':
        return {
          icon: DataArray,
          title: 'No Matching Results',
          message: 'Try adjusting your filters',
          actionLabel: 'Clear Filters'
        };
      default:
        return {
          icon: NoDataIcon,
          title: 'No Data Available',
          message: 'There is no data to display',
          actionLabel: 'Add New'
        };
    }
  };

  const defaultContent = getDefaultContent();

  // Use provided content or fall back to defaults
  const Icon = CustomIcon || defaultContent.icon;
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;
  const displayActionLabel = actionLabel || defaultContent.actionLabel;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight,
        p: 3,
        ...sx
      }}
    >
      <Icon
        sx={{
          fontSize: 80,
          color: theme.palette.action.disabled,
          mb: 2
        }}
      />

      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          mb: 1
        }}
      >
        {displayTitle}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          maxWidth: 400,
          mb: showAction ? 3 : 0
        }}
      >
        {displayMessage}
      </Typography>

      {showAction && onActionClick && (
        <Button
          variant="contained"
          startIcon={type === 'default' ? <AddIcon /> : undefined}
          onClick={onActionClick}
          sx={{
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          {displayActionLabel}
        </Button>
      )}
    </Box>
  );
};

// Preset configurations for common use cases
export const NoSkills = (props) => (
  <NoData
    title="No Skills Available"
    message="There are no skills available at the moment."
    actionLabel="Create Skill"
    {...props}
  />
);

export const NoAssessments = (props) => (
  <NoData
    title="No Assessments"
    message="No assessments have been created yet."
    actionLabel="Create Assessment"
    {...props}
  />
);

export const NoEnrollments = (props) => (
  <NoData
    title="No Enrollments"
    message="You haven't enrolled in any skills yet."
    actionLabel="Browse Skills"
    {...props}
  />
);

export const NoFeedback = (props) => (
  <NoData
    title="No Feedback"
    message="No feedback has been submitted yet."
    showAction={false}
    {...props}
  />
);

export const NoSearchResults = (props) => (
  <NoData
    type="search"
    {...props}
  />
);

export const NoFilteredResults = (props) => (
  <NoData
    type="filtered"
    {...props}
  />
);

export const LoadingError = (props) => (
  <NoData
    type="error"
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) return <LoadingScreen />;
  if (error) return <LoadingError onActionClick={() => fetchData()} />;
  if (data.length === 0) {
    return <NoSkills onActionClick={() => handleCreateSkill()} />;
  }

  return (
    <DataTable
      data={data}
      // ... other props
    />
  );
};
*/

export default NoData;
