import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useCustomHooks';

const SearchInput = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  loading = false,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  showSuggestions = true,
  clearOnSearch = false,
  minLength = 2,
  debounceMs = 300,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  sx = {}
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const anchorRef = useRef(null);
  const debouncedValue = useDebounce(inputValue, debounceMs);

  // Handle controlled input value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedValue && debouncedValue.length >= minLength) {
      onSearch?.(debouncedValue);
    }
  }, [debouncedValue, minLength, onSearch]);

  // Handle input change
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setOpen(showSuggestions && newValue.length > 0);
    setSelectedIndex(-1);
  };

  // Handle clear
  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    setOpen(false);
    setSelectedIndex(-1);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange?.(suggestion);
    onSearch?.(suggestion);
    if (clearOnSearch) {
      handleClear();
    }
    setOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!open) return;

    const suggestions = [...recentSearches, ...trendingSearches, ...suggestions];
    const maxIndex = suggestions.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex <= maxIndex) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          onSearch?.(inputValue);
          if (clearOnSearch) {
            handleClear();
          }
          setOpen(false);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  // Render suggestion section
  const renderSuggestionSection = (items, title, icon) => {
    if (!items || items.length === 0) return null;

    return (
      <>
        <ListItem sx={{ py: 0 }}>
          <ListItemText
            primary={
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {icon}
                {title}
              </Typography>
            }
          />
        </ListItem>
        {items.map((item, index) => (
          <ListItem
            key={index}
            button
            selected={selectedIndex === index}
            onClick={() => handleSuggestionClick(item)}
            sx={{
              py: 0.5,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TextField
        ref={anchorRef}
        fullWidth={fullWidth}
        size={size}
        variant={variant}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(showSuggestions && inputValue.length > 0)}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: inputValue && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        style={{
          width: anchorRef.current?.clientWidth,
          zIndex: theme.zIndex.modal
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper
              elevation={3}
              sx={{
                mt: 1,
                maxHeight: 400,
                overflow: 'auto'
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <List sx={{ py: 1 }}>
                  {renderSuggestionSection(
                    recentSearches,
                    'Recent Searches',
                    <HistoryIcon fontSize="small" />
                  )}
                  {renderSuggestionSection(
                    trendingSearches,
                    'Trending Searches',
                    <TrendingIcon fontSize="small" />
                  )}
                  {renderSuggestionSection(
                    suggestions,
                    'Suggestions',
                    <SearchIcon fontSize="small" />
                  )}
                  {!loading && suggestions.length === 0 && inputValue.length >= minLength && (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                          >
                            No results found
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

// Usage example:
/*
const MyComponent = () => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setLoading(true);
    try {
      // Fetch suggestions based on search value
      const results = await fetchSuggestions(value);
      setSuggestions(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchInput
      value={searchValue}
      onChange={setSearchValue}
      onSearch={handleSearch}
      loading={loading}
      suggestions={suggestions}
      recentSearches={['react', 'javascript', 'typescript']}
      trendingSearches={['nextjs', 'tailwind', 'graphql']}
    />
  );
};
*/

export default SearchInput;
