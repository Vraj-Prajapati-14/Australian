import React from 'react';
import PropTypes from 'prop-types';

/**
 * Table Component - Reusable table with sorting, pagination, and actions
 */
const Table = ({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading = false,
  pagination = false,
  size = 'default',
  className = '',
  ...props
}) => {
  const tableClasses = [
    'table',
    `table-${size}`,
    loading ? 'table-loading' : '',
    className
  ].filter(Boolean).join(' ');

  const renderPagination = () => {
    if (!pagination) return null;
    
    const {
      current = 1,
      pageSize = 10,
      total = 0,
      showSizeChanger = false,
      showQuickJumper = false,
      showTotal = null,
      onChange = () => {},
      onShowSizeChange = () => {}
    } = pagination;

    const totalPages = Math.ceil(total / pageSize);
    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, total);

    return (
      <div className="table-pagination">
        <div className="pagination-info">
          {showTotal ? showTotal(total, [startItem, endItem]) : `${startItem}-${endItem} of ${total} items`}
        </div>
        <div className="pagination-controls">
          <button 
            className="pagination-btn"
            disabled={current <= 1}
            onClick={() => onChange(current - 1, pageSize)}
          >
            Previous
          </button>
          <span className="pagination-current">{current} of {totalPages}</span>
          <button 
            className="pagination-btn"
            disabled={current >= totalPages}
            onClick={() => onChange(current + 1, pageSize)}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="table-container">
      {loading && (
        <div className="table-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <table className={tableClasses} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key || index} className="table-header">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record, rowIndex) => (
            <tr key={record[rowKey] || rowIndex} className="table-row">
              {columns.map((column, colIndex) => (
                <td key={column.key || colIndex} className="table-cell">
                  {column.render ? column.render(record[column.dataIndex], record, rowIndex) : record[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
      render: PropTypes.func
    })
  ),
  dataSource: PropTypes.array,
  rowKey: PropTypes.string,
  loading: PropTypes.bool,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string
};

export default Table;
