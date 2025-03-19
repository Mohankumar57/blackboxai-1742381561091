import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AttachMoney as BudgetIcon,
  EventNote as AttendanceIcon,
  Feedback as FeedbackIcon,
  Assignment as AssessmentIcon
} from '@mui/icons-material';

const navItems = [
  {
    title: 'Dashboard',
    path: '/faculty/dashboard',
    icon: <DashboardIcon />
  },
  {
    title: 'Budget Submission',
    path: '/faculty/budget-submission',
    icon: <BudgetIcon />
  },
  {
    title: 'Attendance',
    path: '/faculty/attendance',
    icon: <AttendanceIcon />
  },
  {
    title: 'Feedback',
    path: '/faculty/feedback',
    icon: <FeedbackIcon />
  },
  {
    title: 'Assessment',
    path: '/faculty/assessment',
    icon: <AssessmentIcon />
  }
];

const FacultyNavItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <List>
      {navItems.map((item) => (
        <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
          <Tooltip title={item.title} placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
                bgcolor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  color: location.pathname === item.path ? 'primary.main' : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'inherit'
                }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
};

export default FacultyNavItems;
