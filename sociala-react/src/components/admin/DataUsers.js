import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table';
import './TableStyles.css';
import SideBar from '../../pages/SideBarAdmin';

const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = React.useState(filter || '');
  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined);
  }, 200);

  return (
    <span className="global-filter">
      <input
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search..."
      />
    </span>
  );
};

const UserTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    pageOptions,
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    state: { pageIndex, pageSize },
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="user-table-container">
      <div className="table-header">
        <h2>Lista de usuarios</h2>
        <div className="table-controls">
          <GlobalFilter filter={state.globalFilter} setFilter={setGlobalFilter} />
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table {...getTableProps()} className="user-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>
        </span>
      </div>
    </div>
  );
};

const DataUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3010/api/v1/users/list');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los datos. Inténtalo nuevamente.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre y Apellido',
        accessor: d => `${d.user?.name || 'N/A'} ${d.user?.last_name || 'N/A'}`,
      },
      {
        Header: 'Cédula',
        accessor: d => d.user?.ci || 'N/A',
      },
      {
        Header: 'Rol',
        accessor: d => d.user?.rol || 'N/A',
      },
      {
        Header: 'Email',
        accessor: d => d.user?.email || 'N/A',
      },
      {
        Header: 'Celular',
        accessor: 'number_phone',
      },
    ],
    []
  );

  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!loading && data.length === 0) {
    return <p>No se encontraron datos de usuarios.</p>;
  }

  return (
    <>
      <SideBar />
      <div className="main-content theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle">
              <div className="container">
                <UserTable columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataUsers;
