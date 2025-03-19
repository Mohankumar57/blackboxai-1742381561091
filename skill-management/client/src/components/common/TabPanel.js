import React from 'react';
import {
  Box,
  Tab as MuiTab,
  Tabs as MuiTabs,
  styled,
  useTheme
} from '@mui/material';

// Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  padding: theme.spacing(1.5, 2),
  marginRight: theme.spacing(2),
  fontWeight: 500,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    opacity: 0.8,
  },
}));

// Styled Tabs component
const Tabs = styled(MuiTabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  '& .MuiTabs-flexContainer': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

// TabPanel component
const TabPanel = ({ children, value, index, ...props }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...props}
  >
    {value === index && (
      <Box sx={{ py: 3 }}>
        {children}
      </Box>
    )}
  </Box>
);

// Main TabsContainer component
const TabsContainer = ({
  tabs,
  value,
  onChange,
  orientation = 'horizontal',
  variant = 'standard', // 'standard', 'fullWidth', 'scrollable'
  centered = false,
  tabProps = {},
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Tabs
        value={value}
        onChange={onChange}
        orientation={orientation}
        variant={variant}
        centered={centered}
        sx={{
          mb: orientation === 'horizontal' ? 0 : undefined,
          mr: orientation === 'vertical' ? 3 : undefined,
          borderRight: orientation === 'vertical' ? `1px solid ${theme.palette.divider}` : undefined,
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon}
            iconPosition={tab.iconPosition || 'start'}
            disabled={tab.disabled}
            {...tabProps}
          />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

// Custom hook for managing tab state
export const useTabs = (defaultValue = 0) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return [value, handleChange];
};

// Preset configurations for common use cases
export const SkillDetailsTabs = ({ skillData, ...props }) => {
  const tabs = [
    {
      label: 'Overview',
      content: skillData.overview
    },
    {
      label: 'Students',
      content: skillData.students
    },
    {
      label: 'Attendance',
      content: skillData.attendance
    },
    {
      label: 'Feedback',
      content: skillData.feedback
    },
    {
      label: 'Assessment',
      content: skillData.assessment
    }
  ];

  return <TabsContainer tabs={tabs} {...props} />;
};

export const AssessmentTabs = ({ assessmentData, ...props }) => {
  const tabs = [
    {
      label: 'Questions',
      content: assessmentData.questions
    },
    {
      label: 'Submissions',
      content: assessmentData.submissions
    },
    {
      label: 'Results',
      content: assessmentData.results
    }
  ];

  return <TabsContainer tabs={tabs} {...props} />;
};

export const StudentProfileTabs = ({ studentData, ...props }) => {
  const tabs = [
    {
      label: 'Enrolled Skills',
      content: studentData.enrolledSkills
    },
    {
      label: 'Attendance',
      content: studentData.attendance
    },
    {
      label: 'Assessments',
      content: studentData.assessments
    }
  ];

  return <TabsContainer tabs={tabs} {...props} />;
};

// Usage example:
/*
const MyComponent = () => {
  const [value, handleChange] = useTabs();

  const tabs = [
    {
      label: 'Tab 1',
      icon: <Icon1 />,
      content: <div>Content 1</div>
    },
    {
      label: 'Tab 2',
      icon: <Icon2 />,
      content: <div>Content 2</div>
    }
  ];

  return (
    <TabsContainer
      tabs={tabs}
      value={value}
      onChange={handleChange}
      variant="fullWidth"
    />
  );
};

// Or using preset configurations:
const SkillDetails = () => {
  const [value, handleChange] = useTabs();
  const skillData = {
    overview: <OverviewComponent />,
    students: <StudentsComponent />,
    attendance: <AttendanceComponent />,
    feedback: <FeedbackComponent />,
    assessment: <AssessmentComponent />
  };

  return (
    <SkillDetailsTabs
      skillData={skillData}
      value={value}
      onChange={handleChange}
    />
  );
};
*/

export default TabsContainer;
