import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  RequestQuote as BudgetReviewIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  SupervisorAccount as UsersIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const navItems = [
  {
    title: 'Dashboard',
    path: '/team/dashboard',
    icon: <DashboardIcon />,
    section: 'main'
  },
  {
    title: 'Budget Reviews',
    path: '/team/budget-review',
    icon: <BudgetReviewIcon />,
    section: 'main'
  },
  {
    title: 'Feedback Analysis',
    path: '/team/feedback-analysis',
    icon: <AnalyticsIcon />,
    section: 'main'
  },
  {
    title: 'Assessment Overview',
    path: '/team/assessment-overview',
    icon: <AssessmentIcon />,
    section: 'main'
  },
  {
    title: 'User Management',
    path: '/team/users',
    icon: <UsersIcon />,
    section: 'admin'
  },
  {
    title: 'Settings',
    path: '/team/settings',
    icon: <SettingsIcon />,
    section: 'admin'
  }
];

const TeamNavItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = navItems.filter(item => item.section === 'main');
  const adminNavItems = navItems.filter(item => item.section === 'admin');

  const NavItem = ({ item }) => (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <Tooltip title={item.title} placement="right">
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: 'initial',
            px: 2.5,
            bgcolor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.08)'
            }
          }}
          onClick={() => navigate(item.path)}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 3,
              justifyContent: 'center',
              color: location.pathname === item.path ? 'primary.main' : 'inherit',
              transition: 'color 0.2s'
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.title}
            sx={{
              color: location.pathname === item.path ? 'primary.main' : 'inherit',
              '& .MuiTypography-root': {
                fontWeight: location.pathname === item.path ? 500 : 400
              },
              transition: 'color 0.2s'
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );

  return (
    <>
      <List>
        {mainNavItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        {adminNavItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </List>
    </>
  );
};

export default TeamNavItems;
