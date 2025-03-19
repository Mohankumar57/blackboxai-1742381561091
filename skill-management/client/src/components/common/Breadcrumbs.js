import React from 'react';
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  useTheme
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Breadcrumbs = ({
  items = [],
  showHome = true,
  separator = <NavigateNextIcon fontSize="small" />,
  maxItems = 8,
  sx = {}
}) => {
  const theme = useTheme();
  const location = useLocation();
  const { user } = useAuth();

  // Get home route based on user role
  const getHomeRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'faculty':
        return '/faculty/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'skillTeam':
        return '/team/dashboard';
      default:
        return '/';
    }
  };

  // Get home label based on user role
  const getHomeLabel = () => {
    if (!user) return 'Home';
    switch (user.role) {
      case 'faculty':
        return 'Faculty Dashboard';
      case 'student':
        return 'Student Dashboard';
      case 'skillTeam':
        return 'Team Dashboard';
      default:
        return 'Home';
    }
  };

  // Generate breadcrumbs automatically from route if no items provided
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      return { label, path: url };
    });
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <MuiBreadcrumbs
        separator={separator}
        maxItems={maxItems}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1
          }
        }}
      >
        {/* Home Link */}
        {showHome && (
          <Link
            component={RouterLink}
            to={getHomeRoute()}
            color="inherit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <HomeIcon
              sx={{
                mr: 0.5,
                fontSize: 20,
                color: theme.palette.primary.main
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {getHomeLabel()}
            </Typography>
          </Link>
        )}

        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return isLast ? (
            <Typography
              key={item.path}
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: 500 }}
            >
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.path}
              component={RouterLink}
              to={item.path}
              color="inherit"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {item.label}
              </Typography>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

// Preset configurations for common use cases
export const SkillBreadcrumbs = ({ skillId, skillName, ...props }) => {
  const items = [
    { label: 'Skills', path: '/skills' },
    { label: skillName || skillId, path: `/skills/${skillId}` }
  ];

  return <Breadcrumbs items={items} {...props} />;
};

export const AssessmentBreadcrumbs = ({ assessmentId, assessmentName, ...props }) => {
  const items = [
    { label: 'Assessments', path: '/assessments' },
    { label: assessmentName || assessmentId, path: `/assessments/${assessmentId}` }
  ];

  return <Breadcrumbs items={items} {...props} />;
};

export const ProfileBreadcrumbs = ({ section, ...props }) => {
  const items = [
    { label: 'Profile', path: '/profile' },
    ...(section ? [{ label: section, path: `/profile/${section.toLowerCase()}` }] : [])
  ];

  return <Breadcrumbs items={items} {...props} />;
};

// Usage example:
/*
// Basic usage with auto-generated breadcrumbs
const MyComponent = () => {
  return <Breadcrumbs />;
};

// Custom breadcrumbs
const MyComponent = () => {
  const breadcrumbItems = [
    { label: 'Skills', path: '/skills' },
    { label: 'Web Development', path: '/skills/web-development' },
    { label: 'React Course', path: '/skills/web-development/react' }
  ];

  return <Breadcrumbs items={breadcrumbItems} />;
};

// Using preset configurations
const SkillPage = () => {
  return (
    <SkillBreadcrumbs
      skillId="123"
      skillName="React Fundamentals"
    />
  );
};
*/

export default Breadcrumbs;
