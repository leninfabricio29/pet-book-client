import React, { useState } from 'react';
import axios from 'axios';

const CreateProfileForm = () => {
  const [formData, setFormData] = useState({
    user: '',
    // Otros campos del perfil que quieras incluir en el formulario
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar solicitud al backend para crear el perfil
      const response = await axios.post('', formData);
      console.log('Perfil creado:', response.data);
      // Limpiar formulario después de éxito
      setFormData({
        user: '',
        // Limpiar otros campos del perfil si es necesario
      });
    } catch (error) {
      console.error('Error al crear perfil:', error.response.data);
      // Manejar errores de acuerdo a tus necesidades
    }
  };

  return (
    <div>
      <h2>Crear Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user">ID de Usuario:</label>
          <input
            type="text"
            id="user"
            name="user"
            value={formData.user}
            onChange={handleChange}
          />
        </div>
        {/* Otros campos del perfil aquí */}
        <button type="submit">Crear Perfil</button>
      </form>
    </div>
  );
};

export default CreateProfileForm;
