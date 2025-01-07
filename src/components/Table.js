import { useState } from 'react';

export default function Table({ columns, columnKeys, items, buttons, actions, idParam }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column}
                onClick={() => requestSort(column)}
                className="px-6 py-3 border-b-2 border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none"
              >
                {column}{getSortDirection(column)}
              </th>
            ))}
            {buttons && buttons.length > 0 && (
              <th className="px-6 py-3 border-b-2 border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, itemIndex) => (
            <tr 
              key={itemIndex}
              className="hover:bg-gray-100"
            >
              {columns.map((column, colIndex) => {
                const key = columnKeys[colIndex]; // Get the property key for the column
                return (
                  <td 
                    key={column}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    {item[key]}
                  </td>
                );
              })}
              {buttons && buttons.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-center">
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
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}