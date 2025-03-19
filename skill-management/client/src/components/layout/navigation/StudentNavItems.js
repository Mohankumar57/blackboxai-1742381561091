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
  School as SkillsIcon,
  EventNote as AttendanceIcon,
  Feedback as FeedbackIcon,
  Assignment as AssessmentIcon
} from '@mui/icons-material';

const navItems = [
  {
    title: 'Dashboard',
    path: '/student/dashboard',
    icon: <DashboardIcon />
  },
  {
    title: 'Available Skills',
    path: '/student/skills',
    icon: <SkillsIcon />
  },
  {
    title: 'My Attendance',
    path: '/student/attendance',
    icon: <AttendanceIcon />
  },
  {
    title: 'Provide Feedback',
    path: '/student/feedback',
    icon: <FeedbackIcon />
  },
  {
    title: 'Assessments',
    path: '/student/assessments',
    icon: <AssessmentIcon />
  }
];

const StudentNavItems = () => {
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
      ))}
    </List>
  );
};

export default StudentNavItems;
