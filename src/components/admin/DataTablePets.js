import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SideBar from '../../pages/SideBarAdmin';

const DatatablePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:3010/api/v1/pets/list');
        setPets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nombre", "Tipo", "Raza", "Sexo", "Edad", "Tamaño", "Color"];
    const tableRows = [];

    pets.forEach(pet => {
      const petData = [
        pet.name,
        pet.type,
        pet.breed,
        pet.sex,
        pet.age,
        pet.size,
        pet.color,
      ];
      tableRows.push(petData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Lista de Mascotas", 14, 15);
    doc.save(`pets_list_${new Date().toISOString()}.pdf`);
  };

  const columns = [
    { field: 'name', headerName: 'Nombre', width: 130 },
    { field: 'type', headerName: 'Tipo', width: 100 },
    { field: 'breed', headerName: 'Raza', width: 130 },
    { field: 'sex', headerName: 'Sexo', width: 100 },
    { field: 'age', headerName: 'Edad', width: 90 },
    { field: 'size', headerName: 'Tamaño', width: 100 },
    { field: 'color', headerName: 'Color', width: 130 },
    { 
      field: 'has_disease', 
      headerName: '¿Tiene enfermedad?', 
      width: 150,
      renderCell: (params) => params.value ? 'Sí' : 'No'
    },
    { 
      field: 'requires_treatment', 
      headerName: '¿Requiere tratamiento?', 
      width: 170,
      renderCell: (params) => params.value ? 'Sí' : 'No'
    },
    { 
      field: 'sterilization_status', 
      headerName: 'Esterilizado', 
      width: 130,
      renderCell: (params) => params.value ? 'Sí' : 'No'
    },
    {
      field: 'photo_url',
      headerName: 'Foto',
      width: 130,
      renderCell: (params) => (
        <img src={params.value} alt={params.row.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
      )
    },
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

          <Button 
            className='mx-2'
            color='success'
            variant="contained"
            onClick={() => handleEdit(params.row._id)}
          >
            <i className='feather-edit'></i>
          </Button>
        </>
      ),
    },
  ];

  const handleDelete = (id) => {
    // Implement delete logic here
    console.log('Delete pet with id:', id);
  };

  const handleEdit = (id) => {
    // Implement edit logic here
    console.log('Edit pet with id:', id);
  };

  return (
    <>
      <SideBar />
      <div className="main-content theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle">
              <div className='alert'>
                <strong>Todas las mascotas registradas en la plataforma</strong>
              </div>
              <Button onClick={exportPDF} variant="contained" color="primary" style={{ marginBottom: 10 }}>
                <i className='feather-printer'></i> Exportar PDF
              </Button>
              <DataGrid
                rows={pets}
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

export default DatatablePets;