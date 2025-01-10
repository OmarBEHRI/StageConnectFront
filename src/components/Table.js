import React, { useState } from 'react';
import { Table as TableMUI, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';

export default function Table({ columns, columnKeys, items, buttons, actions, idParam }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Helper function to determine if a value is a number
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  // Sorting function
  const sortedItems = [...items].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const key = columnKeys[columns.indexOf(sortConfig.key)]; // Get the property key for the column
    const valueA = a[key];
    const valueB = b[key];

    // Handle null/undefined values
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // If both values are numbers, do numeric sorting
    if (isNumber(valueA) && isNumber(valueB)) {
      return sortConfig.direction === 'ascending' 
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    // For strings, do case-insensitive string comparison
    const stringA = String(valueA).toLowerCase();
    const stringB = String(valueB).toLowerCase();

    if (stringA < stringB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (stringA > stringB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (column) => {
    let direction = 'ascending';
    if (sortConfig.key === column && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key: column, direction });
  };

  // Get sort direction indicator
  const getSortDirection = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="overflow-x-auto">
      <TableContainer component={Paper}>
        <TableMUI className="min-w-full bg-white">
          <TableHead>
            <TableRow>
              {buttons && buttons.length > 0 && (
                <TableCell className="px-6 py-3 border-b-2 border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Actions
                </TableCell>
              )}
              {columns.map((column, index) => (
                <TableCell
                  key={column}
                  onClick={() => requestSort(column)}
                  className="px-6 py-3 border-b-2 border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none text-center"
                >
                  {column}{getSortDirection(column)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, itemIndex) => (
              <TableRow 
                key={itemIndex}
                className="hover:bg-gray-100"
              >
                {buttons && buttons.length > 0 && (
                  <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                    {buttons.map((button, buttonIndex) => (
                      <button
                        key={button}
                        onClick={() => {actions[buttonIndex](item[idParam]); console.log(`Console ID: ${item[idParam]}`)}}
                        className={`${
                          button.toLowerCase() === 'delete' 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-blue-600 hover:text-blue-800'
                        } ${
                          buttonIndex < buttons.length - 1 ? 'mr-4' : ''
                        } normal-case`}
                      >
                        {button}
                      </button>
                    ))}
                  </TableCell>
                )}
                {columns.map((column, colIndex) => {
                  const key = columnKeys[colIndex]; // Get the property key for the column
                  return (
                    <TableCell 
                      key={column}
                      className="px-6 py-4 whitespace-nowrap text-center"
                    >
                      {item[key]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </TableMUI>
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedItems.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}