import React from 'react';

type TableColumn<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

type AdminTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyState?: React.ReactNode;
  className?: string;
};

export default function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
  className = '',
}: AdminTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={`admin-table-wrapper ${className}`}>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)}>
              {columns.map((column, colIndex) => {
                const content =
                  typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : (row[column.accessor] as React.ReactNode);

                return (
                  <td key={colIndex} className={column.className}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
