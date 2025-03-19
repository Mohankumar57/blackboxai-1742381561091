import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useTheme
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const FilterChips = ({
  filters = [],
  activeFilters = [],
  onFilterChange,
  onClearAll,
  showLabel = true,
  label = 'Filters:',
  size = 'medium',
  color = 'primary',
  variant = 'outlined',
  sx = {}
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Handle filter menu open
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle filter menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle filter selection
  const handleFilterSelect = (filter) => {
    const isActive = activeFilters.includes(filter.value);
    let newFilters;

    if (filter.exclusive) {
      // For exclusive filters, replace all active filters
      newFilters = isActive ? [] : [filter.value];
    } else {
      // For non-exclusive filters, toggle the selected filter
      newFilters = isActive
        ? activeFilters.filter(f => f !== filter.value)
        : [...activeFilters, filter.value];
    }

    onFilterChange(newFilters);
    if (filter.exclusive) {
      handleClose();
    }
  };

  // Get active filter objects
  const getActiveFilterObjects = () => {
    return filters.filter(filter => activeFilters.includes(filter.value));
  };

  // Group filters by category
  const groupedFilters = filters.reduce((acc, filter) => {
    const category = filter.category || 'default';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(filter);
    return acc;
  }, {});

  return (
    <Box sx={{ ...sx }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        {/* Filter Label */}
        {showLabel && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mr: 1 }}
          >
            {label}
          </Typography>
        )}

        {/* Filter Menu Button */}
        <Tooltip title="Show filters">
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              bgcolor: open ? 'action.selected' : 'transparent',
              mr: 1
            }}
          >
            <FilterIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Active Filter Chips */}
        {getActiveFilterObjects().map((filter) => (
          <Chip
            key={filter.value}
            label={filter.label}
            size={size}
            color={color}
            variant={variant}
            onDelete={() => handleFilterSelect(filter)}
            sx={{
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        ))}

        {/* Clear All Button */}
        {activeFilters.length > 0 && (
          <Tooltip title="Clear all filters">
            <IconButton
              size="small"
              onClick={onClearAll}
              sx={{ ml: 1 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            maxHeight: 400,
            width: 250
          }
        }}
      >
        {Object.entries(groupedFilters).map(([category, categoryFilters], index) => (
          <React.Fragment key={category}>
            {index > 0 && <Divider />}
            {category !== 'default' && (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: 'block',
                  color: 'text.secondary'
                }}
              >
                {category}
              </Typography>
            )}
            {categoryFilters.map((filter) => (
              <MenuItem
                key={filter.value}
                onClick={() => handleFilterSelect(filter)}
                selected={activeFilters.includes(filter.value)}
                sx={{
                  py: 1,
                  px: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <Typography variant="body2">
                    {filter.label}
                  </Typography>
                  {filter.count !== undefined && (
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 2,
                        color: 'text.secondary',
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1
                      }}
                    >
                      {filter.count}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </Menu>
    </Box>
  );
};

// Preset configurations for common use cases
export const SkillFilters = ({ onFilterChange, activeFilters = [], ...props }) => {
  const filters = [
    {
      category: 'Type',
      value: 'daySkill',
      label: 'Day Skills',
      count: 12
    },
    {
      category: 'Type',
      value: 'nightSkill',
      label: 'Night Skills',
      count: 8
    },
    {
      category: 'Status',
      value: 'active',
      label: 'Active',
      count: 15
    },
    {
      category: 'Status',
      value: 'pending',
      label: 'Pending',
      count: 5
    }
  ];

  return (
    <FilterChips
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      {...props}
    />
  );
};

export const AssessmentFilters = ({ onFilterChange, activeFilters = [], ...props }) => {
  const filters = [
    {
      category: 'Status',
      value: 'upcoming',
      label: 'Upcoming',
      count: 3
    },
    {
      category: 'Status',
      value: 'ongoing',
      label: 'Ongoing',
      count: 2
    },
    {
      category: 'Status',
      value: 'completed',
      label: 'Completed',
      count: 10
    }
  ];

  return (
    <FilterChips
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      {...props}
    />
  );
};

// Usage example:
/*
const MyComponent = () => {
  const [activeFilters, setActiveFilters] = useState([]);

  const filters = [
    {
      category: 'Status',
      value: 'active',
      label: 'Active',
      count: 10
    },
    {
      category: 'Status',
      value: 'inactive',
      label: 'Inactive',
      count: 5
    },
    {
      category: 'Type',
      value: 'basic',
      label: 'Basic',
      count: 8
    },
    {
      category: 'Type',
      value: 'premium',
      label: 'Premium',
      count: 7
    }
  ];

  return (
    <FilterChips
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      onClearAll={() => setActiveFilters([])}
    />
  );
};
*/

export default FilterChips;
