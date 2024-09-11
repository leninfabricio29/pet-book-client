import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { formatDistanceToNowStrict, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import './TableStyles.css';
import SideBar from '../../pages/SideBarAdmin';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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
        placeholder="Buscar..."
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

const DeleteConfirmModal = ({ show, onHide, onConfirm }) => (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Estás seguro de que deseas eliminar este usuario?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>No</Button>
        <Button variant="danger" onClick={onConfirm}>Sí, eliminar</Button>
      </Modal.Footer>
    </Modal>
  );

const DataUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3010/api/v1/users/allUsers');
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

  const handleDeleteClick = (user) => {
    setShowDeleteModal(true);
  };


  const handleDeleteConfirm = () => {
    // Aquí agregar la lógica de eliminación del usuario (hacer la llamada a la API)
    setShowDeleteModal(false);
  };


  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre y Apellido',
        accessor: d => `${d?.name || 'N/A'} ${d?.last_name || 'N/A'}`,
      },
      
      {
        Header: 'Email',
        accessor: d => d?.email || 'N/A',
      },
      {
        Header: 'Estado',
        accessor: d => d?.status_profile ? 'Activo' : 'Inactivo' || 'N/A',
      }
      ,
      {
        Header: 'Ultima interacción',
        accessor: d => {
          const lastInteraction = d?.last_interaction;
          if (!lastInteraction) return 'N/A';

          const date = parseISO(lastInteraction);
          const daysDifference = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));

          let colorClass = '';
          if (daysDifference >= 7) {
            colorClass = 'red';
          } else if (daysDifference === 6) {
            colorClass = 'orange';
          } else if (daysDifference >= 4 && daysDifference <= 5) {
            colorClass = 'blue';
          } else if (daysDifference <= 3) {
            colorClass = 'green';
          }

          return (
            <span className={colorClass}>
              {formatDistanceToNowStrict(date, { locale: es, addSuffix: true })}
            </span>
          );
        },
      },
      {
        Header: 'Operaciones',
        accessor: d => (
          <div className="operations d-flex justify-content-around">
            <button className="btn btn-info btn-sm"><i className='feather-eye text-ligh'></i></button>
            <button className="btn btn-danger btn-sm "  onClick={() => handleDeleteClick(d.user)} ><i className='feather-trash text-light'></i></button>
          </div>
        ),
      }
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
        <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      </div>
    </>
  );
};

export default DataUsers;
