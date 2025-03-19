import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'background.default',
        borderRadius: theme.shape.borderRadius,
        ...sx
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return isLast ? (
              <Typography
                key={crumb.path || index}
                color="text.primary"
                fontSize="0.875rem"
              >
                {crumb.label}
              </Typography>
            ) : (
              <MuiLink
                key={crumb.path || index}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
                fontSize="0.875rem"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {crumb.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Header Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: subtitle ? 1 : 0
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                lineHeight: 1.5
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action Button/Component */}
        {action && (
          <Box sx={{ ml: 2 }}>
            {action}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PageHeader;
