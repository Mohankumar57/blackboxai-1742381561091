import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Chart = ({
  type = 'bar', // 'bar', 'line', 'pie'
  data = [],
  title,
  subtitle,
  xAxisKey = 'name',
  yAxisKey = 'value',
  series = [],
  colors,
  showGrid = true,
  showLegend = true,
  height = 300,
  loading = false,
  error = false,
  emptyMessage = 'No data available',
  sx = {}
}) => {
  const theme = useTheme();

  // Default colors
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  // Use provided colors or default colors
  const chartColors = colors || defaultColors;

  // Loading or error state
  if (loading || error || !data.length) {
    return (
      <Card sx={sx}>
        {(title || subtitle) && (
          <CardHeader
            title={title}
            subheader={subtitle}
            titleTypographyProps={{ variant: 'h6' }}
            subheaderTypographyProps={{ variant: 'body2' }}
          />
        )}
        <CardContent>
          <Box
            sx={{
              height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {loading ? 'Loading...' : error ? 'Error loading data' : emptyMessage}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis tick={{ fill: theme.palette.text.secondary }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              {showLegend && <Legend />}
              {series.length ? (
                series.map((item, index) => (
                  <Bar
                    key={item.dataKey}
                    dataKey={item.dataKey}
                    name={item.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))
              ) : (
                <Bar
                  dataKey={yAxisKey}
                  fill={chartColors[0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis tick={{ fill: theme.palette.text.secondary }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              {showLegend && <Legend />}
              {series.length ? (
                series.map((item, index) => (
                  <Line
                    key={item.dataKey}
                    type="monotone"
                    dataKey={item.dataKey}
                    name={item.name}
                    stroke={chartColors[index % chartColors.length]}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={yAxisKey}
                  stroke={chartColors[0]}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry[xAxisKey]}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={sx}>
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          titleTypographyProps={{ variant: 'h6' }}
          subheaderTypographyProps={{ variant: 'body2' }}
        />
      )}
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

// Preset configurations for common use cases
export const SkillEnrollmentChart = ({ data, ...props }) => (
  <Chart
    type="bar"
    title="Skill Enrollments"
    subtitle="Number of students enrolled per skill"
    data={data}
    xAxisKey="skillName"
    yAxisKey="enrollments"
    {...props}
  />
);

export const AssessmentResultsChart = ({ data, ...props }) => (
  <Chart
    type="line"
    title="Assessment Results"
    subtitle="Average scores over time"
    data={data}
    xAxisKey="date"
    series={[
      { dataKey: 'averageScore', name: 'Average Score' },
      { dataKey: 'passingScore', name: 'Passing Score' }
    ]}
    {...props}
  />
);

export const SkillDistributionChart = ({ data, ...props }) => (
  <Chart
    type="pie"
    title="Skill Distribution"
    subtitle="Distribution of skills by category"
    data={data}
    xAxisKey="category"
    yAxisKey="count"
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  const barData = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 15 }
  ];

  const lineData = [
    { date: '2023-01', value1: 100, value2: 200 },
    { date: '2023-02', value1: 150, value2: 250 },
    { date: '2023-03', value1: 200, value2: 300 }
  ];

  const pieData = [
    { name: 'Category A', value: 30 },
    { name: 'Category B', value: 45 },
    { name: 'Category C', value: 25 }
  ];

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Chart
        type="bar"
        data={barData}
        title="Bar Chart"
      />

      <Chart
        type="line"
        data={lineData}
        title="Line Chart"
        series={[
          { dataKey: 'value1', name: 'Series 1' },
          { dataKey: 'value2', name: 'Series 2' }
        ]}
      />

      <Chart
        type="pie"
        data={pieData}
        title="Pie Chart"
      />
    </Box>
  );
};
*/

export default Chart;
