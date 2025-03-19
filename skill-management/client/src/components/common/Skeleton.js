import React from 'react';
import {
  Skeleton as MuiSkeleton,
  Box,
  Card,
  CardHeader,
  CardContent,
  useTheme,
  styled
} from '@mui/material';

// Styled components
const StyledSkeleton = styled(MuiSkeleton)(({ theme }) => ({
  transform: 'none',
  transformOrigin: '0 0',
  '&::after': {
    animation: 'wave 1.6s linear 0.5s infinite'
  }
}));

const Skeleton = ({
  variant = 'rectangular', // 'text', 'rectangular', 'circular', 'rounded'
  width,
  height,
  animation = 'wave', // 'pulse', 'wave', false
  children,
  sx = {}
}) => (
  <StyledSkeleton
    variant={variant}
    width={width}
    height={height}
    animation={animation}
    sx={sx}
  >
    {children}
  </StyledSkeleton>
);

// Preset configurations for common use cases
export const TextSkeleton = ({
  lines = 1,
  width = '100%',
  spacing = 1,
  ...props
}) => (
  <Box sx={{ width }}>
    {Array(lines).fill(0).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={typeof width === 'number' ? `${Math.random() * 20 + 80}%` : width}
        sx={{ mb: index < lines - 1 ? spacing : 0 }}
        {...props}
      />
    ))}
  </Box>
);

export const CardSkeleton = ({
  hasHeader = true,
  headerAction = false,
  contentLines = 3,
  ...props
}) => (
  <Card {...props}>
    {hasHeader && (
      <CardHeader
        avatar={
          <Skeleton
            variant="circular"
            width={40}
            height={40}
          />
        }
        title={
          <Skeleton
            variant="text"
            width="60%"
          />
        }
        subheader={
          <Skeleton
            variant="text"
            width="40%"
          />
        }
        action={
          headerAction && (
            <Skeleton
              variant="rectangular"
              width={48}
              height={48}
              sx={{ borderRadius: 1 }}
            />
          )
        }
      />
    )}
    <CardContent>
      <TextSkeleton lines={contentLines} />
    </CardContent>
  </Card>
);

export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  ...props
}) => (
  <Box {...props}>
    {hasHeader && (
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1
        }}
      >
        {Array(columns).fill(0).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={`${100 / columns}%`}
          />
        ))}
      </Box>
    )}
    {Array(rows).fill(0).map((_, rowIndex) => (
      <Box
        key={rowIndex}
        sx={{
          display: 'flex',
          gap: 2,
          mb: 1,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1
        }}
      >
        {Array(columns).fill(0).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            width={`${100 / columns}%`}
          />
        ))}
      </Box>
    ))}
  </Box>
);

export const GridSkeleton = ({
  items = 6,
  columns = 3,
  spacing = 2,
  ...props
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: spacing
    }}
    {...props}
  >
    {Array(items).fill(0).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </Box>
);

// Custom skeletons for specific use cases
export const SkillCardSkeleton = (props) => (
  <CardSkeleton
    hasHeader={true}
    headerAction={true}
    contentLines={2}
    sx={{
      height: '100%'
    }}
    {...props}
  />
);

export const AssessmentCardSkeleton = (props) => (
  <CardSkeleton
    hasHeader={true}
    contentLines={4}
    sx={{
      height: '100%'
    }}
    {...props}
  />
);

export const ProfileSkeleton = (props) => (
  <Box {...props}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        mb: 4
      }}
    >
      <Skeleton
        variant="circular"
        width={120}
        height={120}
      />
      <Box sx={{ flex: 1 }}>
        <TextSkeleton
          lines={3}
          spacing={2}
        />
      </Box>
    </Box>
    <TextSkeleton
      lines={5}
      spacing={2}
    />
  </Box>
);

// Usage example:
/*
const MyComponent = () => {
  const loading = true;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextSkeleton
          lines={3}
          width="100%"
        />

        <CardSkeleton
          hasHeader={true}
          headerAction={true}
          contentLines={4}
        />

        <TableSkeleton
          rows={5}
          columns={4}
        />

        <GridSkeleton
          items={6}
          columns={3}
        />

        <ProfileSkeleton />
      </Box>
    );
  }

  return <div>Content</div>;
};

// Using preset configurations
const SkillsGrid = () => {
  const loading = true;

  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2
        }}
      >
        {Array(6).fill(0).map((_, index) => (
          <SkillCardSkeleton key={index} />
        ))}
      </Box>
    );
  }

  return <div>Skills Grid</div>;
};
*/

export default Skeleton;
