import React from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  TrendingUp as IncreaseIcon,
  TrendingDown as DecreaseIcon,
  TrendingFlat as NoChangeIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  loading = false,
  error = false,
  info,
  color = 'primary',
  variant = 'contained', // 'contained', 'outlined', 'gradient'
  onClick,
  sx = {}
}) => {
  const theme = useTheme();

  // Get trend icon and color
  const getTrendIcon = () => {
    if (trend === 'increase') return <IncreaseIcon sx={{ color: theme.palette.success.main }} />;
    if (trend === 'decrease') return <DecreaseIcon sx={{ color: theme.palette.error.main }} />;
    return <NoChangeIcon sx={{ color: theme.palette.text.secondary }} />;
  };

  const getTrendColor = () => {
    if (trend === 'increase') return theme.palette.success.main;
    if (trend === 'decrease') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  // Get background styles based on variant
  const getBackgroundStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          bgcolor: 'background.paper',
          border: 1,
          borderColor: `${color}.main`
        };
      case 'gradient':
        return {
          background: `linear-gradient(45deg, ${theme.palette[color].main} 0%, ${theme.palette[color].light} 100%)`,
          color: 'white'
        };
      default:
        return {
          bgcolor: `${color}.lighter`,
          color: `${color}.darker`
        };
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 4
        } : {},
        ...getBackgroundStyles(),
        ...sx
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: variant === 'gradient' ? 'white' : 'text.primary'
            }}
          >
            {title}
          </Typography>

          {info && (
            <Tooltip title={info}>
              <IconButton size="small">
                <InfoIcon
                  fontSize="small"
                  sx={{
                    color: variant === 'gradient' ? 'white' : 'text.secondary'
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Content */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 2
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography
            color="error"
            variant="body2"
            sx={{ py: 2 }}
          >
            Error loading data
          </Typography>
        ) : (
          <Box>
            {/* Main Value */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {Icon && (
                <Icon
                  sx={{
                    fontSize: 40,
                    color: variant === 'gradient' ? 'white' : `${color}.main`
                  }}
                />
              )}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: variant === 'gradient' ? 'white' : 'text.primary'
                }}
              >
                {value}
              </Typography>
            </Box>

            {/* Subtitle */}
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: variant === 'gradient' ? 'white' : 'text.secondary'
                }}
              >
                {subtitle}
              </Typography>
            )}

            {/* Trend */}
            {(trend || trendValue) && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 2
                }}
              >
                {getTrendIcon()}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: variant === 'gradient' ? 'white' : getTrendColor()
                  }}
                >
                  {trendValue}
                </Typography>
                {trendLabel && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: variant === 'gradient' ? 'white' : 'text.secondary'
                    }}
                  >
                    {trendLabel}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
};

// Preset configurations for common use cases
export const SkillStatsCard = ({ totalSkills, activeSkills, ...props }) => (
  <StatsCard
    title="Total Skills"
    value={totalSkills}
    subtitle={`${activeSkills} Active Skills`}
    trend={activeSkills > 0 ? 'increase' : 'decrease'}
    trendValue={`${((activeSkills / totalSkills) * 100).toFixed(1)}%`}
    trendLabel="Active Rate"
    color="primary"
    {...props}
  />
);

export const StudentStatsCard = ({ totalStudents, enrolledStudents, ...props }) => (
  <StatsCard
    title="Total Students"
    value={totalStudents}
    subtitle={`${enrolledStudents} Enrolled Students`}
    trend={enrolledStudents > 0 ? 'increase' : 'decrease'}
    trendValue={`${((enrolledStudents / totalStudents) * 100).toFixed(1)}%`}
    trendLabel="Enrollment Rate"
    color="success"
    {...props}
  />
);

export const AssessmentStatsCard = ({ totalAssessments, passRate, ...props }) => (
  <StatsCard
    title="Assessments"
    value={totalAssessments}
    subtitle="Total Assessments"
    trend={passRate >= 70 ? 'increase' : 'decrease'}
    trendValue={`${passRate}%`}
    trendLabel="Pass Rate"
    color="info"
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <StatsCard
        title="Total Users"
        value="1,234"
        subtitle="Active users this month"
        trend="increase"
        trendValue="+12.5%"
        trendLabel="vs last month"
        color="primary"
      />
      <SkillStatsCard
        totalSkills={50}
        activeSkills={35}
      />
      <StudentStatsCard
        totalStudents={1000}
        enrolledStudents={750}
      />
      <AssessmentStatsCard
        totalAssessments={25}
        passRate={85}
      />
    </Box>
  );
};
*/

export default StatsCard;
