import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SideBar from '../../pages/SideBarAdmin';

const DatatableUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3010/api/v1/users/list');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3010/api/v1/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Last Name", "Email", "Phone", "Description"];
    const tableRows = [];

    users.forEach(user => {
      const userData = [
        user.user.name,
        user.user.last_name,
        user.user.ci,
        user.user.username,
        user.user.email,
        user.number_phone,
      ];
      tableRows.push(userData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("User List", 14, 15);
    doc.save(`user_list_${new Date().toISOString()}.pdf`);
  };

  const columns = [
    {
        field: 'name',
        headerName: 'Nombre Completo',
        width: 150,
        renderCell: (params) => (
          <span>{`${params.row.user.name} ${params.row.user.last_name}`}</span>
        ),
    },
    { field: 'identidad', headerName: 'N. Identidad', width: 150, renderCell: (params) => params.row.user.ci },
    { field: 'username', headerName: 'Username', width: 150, renderCell: (params) => params.row.user.username },
    { field: 'email', headerName: 'Email', width: 200, renderCell: (params) => params.row.user.email },

    { field: 'rol', headerName: 'Rol', width: 150, renderCell: (params) => params.row.user.rol },
    {
      field: 'options',
      headerName: 'Opciones',
      width: 170,
      renderCell: (params) => (

        <>
        <Button 
        color='secondary'
          variant="contained"
          onClick={() => handleDelete(params.row._id)}
        >
          <i className='feather-delete'></i>
        </Button>

        <Button className='mx-2'
        color='success'
          variant="contained"
          onClick={() => handleDelete(params.row._id)}
        >
          <i className='feather-edit'></i>
        </Button>
        </>
        

        
      ),
    },
  ];

  return (
    <>
      <SideBar />
      <div className="main-content theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle">
                <div className='alert'>
                    <strong>Todos los usuario registrados en la plataforma</strong>

                </div>
              <Button onClick={exportPDF} variant="contained" color="primary" style={{ marginBottom: 10 }}>
                <i className='feather-printer'></i>
              </Button>
              <DataGrid
                rows={users}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                loading={loading}
                getRowId={(row) => row._id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DatatableUsers;
