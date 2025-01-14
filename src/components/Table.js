import React, { useState } from 'react';
import { Table as TableMUI, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, IconButton, Box } from '@mui/material';
import { Edit, Delete, Upload, Download, Description, Assessment } from '@mui/icons-material';
import getFicheDescriptiveDeStage from '@/utils/downloadFicheDescriptive';
import getFicheEvaluation from '@/utils/downloadFicheEvaluation';

export default function Table({ columns, columnKeys, items, buttons, actions, idParam }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');

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

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filter items based on the filter text
  const filteredItems = sortedItems.filter(item => {
    return columnKeys.some(key => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(filter.toLowerCase());
    });
  });

  return (
    <div className="overflow-x-auto">
      <TextField
        label="Search"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
      />
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
            {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, itemIndex) => (
              <TableRow
                key={itemIndex}
                className="hover:bg-gray-100"
              >
                {buttons && buttons.length > 0 && (
                  <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                    <Box display="flex" gap={1} justifyContent="center">
                      {buttons.map((button, buttonIndex) => {
                        const buttonText = button.toLowerCase();
                        if (buttonText === 'modifier') {
                          return (
                            <IconButton
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                          );
                        } else if (buttonText === 'désactiver') {
                          return (
                            <IconButton
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              color="secondary"
                            >
                              <Delete />
                            </IconButton>
                          );
                        } else if (buttonText === 'déposer convention') {
                          return (
                            <IconButton
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              color="primary"
                            >
                              <Upload />
                            </IconButton>
                          );
                        } else if (buttonText === 'télécharger attestation' && item["attestationDeStage"] != null) {
                          return (
                            <IconButton
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              color="primary"
                            >
                              <Download />
                            </IconButton>
                          );
                        } else if (buttonText === 'fiche descriptive') {
                          return (
                            <IconButton
                              key={button}
                              onClick={() => getFicheDescriptiveDeStage(item)}
                              color="primary"
                            >
                              <Description />
                            </IconButton>
                          );
                        } else if (buttonText === "fiche d'évaluation") {
                          return (
                            <IconButton
                              key={button}
                              onClick={() => getFicheEvaluation(item)}
                              color="primary"
                            >
                              <Assessment />
                            </IconButton>
                          );
                        } else if (buttonText === 'télecharger convention' && item["conventionDeStage"] != null) {
                          return (
                            <button
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              className="text-blue-600 hover:text-blue-800 normal-case"
                            >
                              {button}
                            </button>
                          );
                        } else if (buttonText === 'télecharger attestation' && item["attestationDeStage"] != null) {
                          return (
                            <button
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              className="text-blue-600 hover:text-blue-800 normal-case"
                            >
                              {button}
                            </button>
                          );
                        } else if (buttonText === 'déposer attestation') {
                          return (
                            <button
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              className="text-blue-600 hover:text-blue-800 normal-case"
                            >
                              {button}
                            </button>
                          );
                        } else if (buttonText === 'déposer convention') {
                          return (
                            <button
                              key={button}
                              onClick={() => actions[buttonIndex](item[idParam])}
                              className="text-blue-600 hover:text-blue-800 normal-case"
                            >
                              {button}
                            </button>
                          );
                        }
                        return null;
                      })}
                    </Box>
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
        count={filteredItems.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}