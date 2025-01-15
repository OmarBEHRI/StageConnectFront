import React, { useState } from 'react';
import {
  Table as TableMUI,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  IconButton,
  Box,
  styled
} from '@mui/material';
import { Edit, Delete, Upload, Download, Description, Assessment, CheckCircle, Cancel, Assignment } from '@mui/icons-material';
import getFicheDescriptiveDeStage from '@/utils/downloadFicheDescriptive';
import getFicheEvaluation from '@/utils/downloadFicheEvaluation';

// Custom Styled Components
const StyledTableContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: 'none',
}));

const StyledTable = styled(TableMUI)(({ theme }) => ({
  backgroundColor: 'white',
  '& thead th': {
    backgroundColor: '#F2F2F2', // Light grey for headers
    color: '#333', // Dark grey for text
    fontWeight: 'bold',
  },
  '& tbody td': {
    color: '#555', // Medium grey for text
  },
  '& tbody tr:hover': {
    backgroundColor: '#E0E0E0', // Lighter grey on hover
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: 'white',
    color: '#333',
    borderRadius: 4,
    border: '1px solid #D9D9D9',
  },
  '& .MuiInputLabel-root': {
    color: '#666',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#333',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: '#666',
  '&:hover': {
    color: '#000',
  },
}));

export default function Table({ columns, columnKeys, items, buttons, actions, idParam }) {
  // State and Functions remain the same as in the original code

  return (
    <div className="overflow-x-auto">
      <StyledTextField
        label="Search"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        sx={{ mb: 2 }}
      />
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              {buttons && buttons.length > 0 && (
                <TableCell className="px-6 py-3 text-center">Actions</TableCell>
              )}
              {columns.map((column, index) => (
                <TableCell
                  key={column}
                  onClick={() => requestSort(column)}
                  className="cursor-pointer text-center"
                >
                  {column}{getSortDirection(column)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, itemIndex) => (
              <TableRow key={itemIndex}>
                {buttons && buttons.length > 0 && (
                  <TableCell className="text-center">
                    <Box display="flex" gap={1} justifyContent="center">
                      {buttons.map((button, buttonIndex) => {
                        // Button mapping and rendering remain the same, using StyledIconButton
                        // ...
                      })}
                    </Box>
                  </TableCell>
                )}
                {columns.map((column, colIndex) => {
                  const key = columnKeys[colIndex];
                  return (
                    <TableCell key={column} className="text-center">
                      {item[key]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <TablePagination
        component="div"
        count={filteredItems.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-root': {
            backgroundColor: 'white',
            borderTop: '1px solid #E0E0E0',
          },
          '& .MuiTablePagination-select': {
            color: '#333',
          },
          '& .MuiTablePagination-caption': {
            color: '#555',
          },
        }}
      />
    </div>
  );
}