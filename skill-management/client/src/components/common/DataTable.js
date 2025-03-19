import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import { LoadingOverlay } from './LoadingScreen';

const DataTable = ({
  columns,
  data,
  loading = false,
  title,
  selectable = false,
  searchable = true,
  exportable = true,
  filterable = true,
  pagination = true,
  onRowClick,
  actions,
  emptyMessage = 'No data available'
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState([]);

  // Handle sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // Handle selection
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map(row => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // Filter and sort data
  const filteredData = data.filter(row => {
    if (!searchQuery) return true;
    
    return columns.some(column => {
      const value = row[column.field];
      if (!value) return false;
      return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const sortedData = orderBy
    ? filteredData.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        
        if (order === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return bValue < aValue ? -1 : 1;
        }
      })
    : filteredData;

  // Paginate data
  const paginatedData = pagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;

  // Export data
  const handleExport = () => {
    const csvContent = [
      columns.map(column => column.headerName).join(','),
      ...sortedData.map(row =>
        columns
          .map(column => {
            const value = row[column.field];
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title || 'export'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <LoadingOverlay loading={loading}>
        {/* Table Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="h6" component="div">
            {title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {searchable && (
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            )}

            {filterable && (
              <Tooltip title="Filter list">
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            )}

            {exportable && (
              <Tooltip title="Export data">
                <IconButton onClick={handleExport}>
                  <ExportIcon />
                </IconButton>
              </Tooltip>
            )}

            {actions}
          </Box>
        </Box>

        {/* Table Content */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < data.length}
                      checked={data.length > 0 && selected.length === data.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.align || 'left'}
                    sortDirection={orderBy === column.field ? order : false}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow
                    hover
                    key={row.id || index}
                    onClick={() => onRowClick && onRowClick(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.indexOf(row.id) !== -1}
                          onChange={(event) => handleSelectClick(event, row.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align || 'left'}
                      >
                        {column.renderCell
                          ? column.renderCell(row)
                          : row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    align="center"
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        py: 4
                      }}
                    >
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </LoadingOverlay>
    </Paper>
  );
};

export default DataTable;
