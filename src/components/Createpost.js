import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Switch } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MapComponent from '../components/MapComponent';

class Createpost extends Component {
  state = {
    isOpen: false,
    postType: null,
    pets: [],
    selectedPet: null,
    rewardToggle: false,
    location: null,
    petDescription: '',
    petDescriptionText: '',
    petDescriptionAdoption: '',
    latitude: null,
    longitude: null,
    petImage: ''
  };

  componentDidMount() {
    this.fetchPets();
  }

  fetchPets = async () => {
    try {
      const response = await axios.post('http://localhost:3010/api/v1/pets/search', {
        owner: JSON.parse(localStorage.getItem('user'))._id
      });

      const petsWithTrueStatus = response.data.filter(pet => pet.status === true);
      this.setState({ pets: petsWithTrueStatus });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  handlePostTypeChange = (selectedOption) => {
    this.setState({ postType: selectedOption, rewardToggle: false });
  }

  handleRewardToggleChange = () => {
    this.setState({ rewardToggle: !this.state.rewardToggle });
  }

  handleMapClick = (e) => {
    const { latLng } = e;
    const latitude = latLng.lat();
    const longitude = latLng.lng();

    this.setState({ location: latLng.toJSON(), latitude, longitude });
  }

  handlePetDescriptionChange = (event) => {
    this.setState({ petDescriptionText: event.target.value });
  }

  handlePetChange = (selectedPet) => {
    this.setState({ selectedPet });
  }

  generatePost = () => {
    const { selectedPet, pets, rewardToggle } = this.state;
    if (!selectedPet) return;

    const petId = selectedPet.value;
    const pet = pets.find(p => p._id === petId);

    if (pet) {
      const petDescription = `Hola, me llamo ${pet.name}. Tengo ${pet.age} meses de edad, soy de tamaño ${pet.size}, y  soy de color ${pet.color}. Si me ves, por favor contacta a mi dueño. Recompensa: ${rewardToggle ? 'Sí' : 'No'}.`;
      this.setState({
        petDescription,
        petImage: pet.photo_url
      });
    }
  }

  generatePostAdoption = () => {
    const { selectedPet, pets } = this.state;
    if (!selectedPet) return;

    const petId = selectedPet.value;
    const pet = pets.find(p => p._id === petId);

    if (pet) {
      const petDescriptionAdoption = `Hola, me llamo ${pet.name}. Tengo ${pet.age} meses de edad, soy de tamaño ${pet.size}, y soy de color ${pet.color}. Estoy en busca de una nueva familia que me brinde afecto y cariño.`;
      this.setState({
        petDescriptionAdoption,
        petImage: pet.photo_url,
        
      });
    }
  }

  handleSubmit = async () => {
    const { postType, selectedPet, rewardToggle, latitude, longitude, petDescription, petDescriptionAdoption, petDescriptionText, petImage } = this.state;
    const { _id: owner } = JSON.parse(localStorage.getItem('user'));

    if (postType.value !== 'Avistamiento' && !selectedPet) {
      toast.error("Por favor selecciona una mascota.");
      return;
    }

    let body, pet;

    if (postType.value === 'Perdida') {
      body = petDescription;
      pet = selectedPet.value;
    } else if (postType.value === 'Adopcion') {
      body = petDescriptionAdoption;
      pet = selectedPet.value;
    } else if (postType.value === 'Avistamiento') {
      body = petDescriptionText;
      // Para avistamiento, no necesitamos un pet específico
    }

    try {
      const formData = new FormData();
      formData.append('type', postType.value);
      formData.append('body', body);
      if (postType.value === 'Perdida' || postType.value === 'Avistamiento') {
        formData.append('coordinates', JSON.stringify([longitude, latitude]));
      }
      formData.append('reward', rewardToggle ? '100' : '0');
      formData.append('owner', owner);
      if (pet) formData.append('pet', pet);
      if (postType.value === 'Avistamiento' && petImage) {
        formData.append('photo_post_url', petImage);
      }
    
      await axios.post('http://localhost:3010/api/v1/posts/new', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
      toast.success("Publicación creada correctamente");
    } catch (error) {
      toast.error('Error al crear la publicación.');
      console.error(error);
    }
  }


  renderLostForm() {
    const { pets, selectedPet, rewardToggle, location, latitude, longitude, petDescription, petImage } = this.state;

    const petOptions = pets.map(pet => ({
      value: pet._id,
      label: `${pet.name} - ${pet.breed}`
    }));

    return (
      <div className='form'>
        <div className='alert alert-warning mt-3'>
          <span className="fw-500">Por favor selecciona la mascota perdida, presiona el botón "Generar Publicación", nosotros crearemos el cuerpo del reporte.</span>
        </div>

        <div className='form-group mt-3'>
          <label className='fw-700 text-first'>
            Mascota:
          </label>
          <Select
            required
            placeholder="Selecciona:"
            value={selectedPet}
            onChange={this.handlePetChange}
            options={petOptions}
          />
        </div>

        <div className='text-center mt-4'>
          <button className='btn btn-secondary' onClick={this.generatePost}>Generar publicación <i className='feather-loader'></i></button>
        </div>

        <div className='form-group mt-3'>
          <label className='fw-700'>Descripción:</label>
          <div className='d-flex justify-content-around border rounded p-2'>
            <div className='col border rounded m-2'>
              {petImage && <img width={150} src={petImage} alt='Mascota' />}
            </div>
            <div className='col border rounded m-2 p-2'>
              <p>{petDescription}</p>
            </div>
          </div>
        </div>

        <div className="form-group mt-3">
          <label className='fw-700'>Recompensa:</label>
          <div className="d-flex align-items-center">
            <span>No</span>
            <Switch
              color="success"
              checked={rewardToggle}
              onChange={this.handleRewardToggleChange}
            />
            <span>Sí</span>
          </div>
        </div>

        <div className="form-group mt-3">
          <label className='fw-700 text-first'>
            Latitud:
          </label>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Latitud"
            value={latitude || ''}
            readOnly
          />
        </div>

        <div className="form-group mt-3">
          <label className='fw-700 text-first'>
            Longitud:
          </label>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Longitud"
            value={longitude || ''}
            readOnly
          />
        </div>

        <div className="form-group mt-3">
          <label className='fw-700 text-first'>
            Ubicación:
          </label>
          <MapComponent
            location={location}
            onMapClick={this.handleMapClick}
          />
        </div>

        <div className='text-center mt-4'>
          <button className='btn btn-success text-light fw-700' onClick={this.handleSubmit}> Publicar <i className='feather-send'></i></button>
        </div>
      </div>
    );
  }

  renderSightingForm() {
    const { petDescriptionText, location, latitude, longitude, petImage} = this.state;

    return (
      <div className='form-group mt-3'>
        <label className='fw-700 text-first'>
          Descripción de la mascota:
        </label>
        <textarea
          className="form-control mt-2"
          placeholder="Descripción de la mascota"
          value={petDescriptionText}
          onChange={this.handlePetDescriptionChange}
        ></textarea>

    <div className="form-group mt-3">
          <label className='fw-700 text-first'>
            Fotografía:
          </label>
          <input
            type="file"
            className="form-control mt-2"
            onChange={(e) => this.setState({ petImage: e.target.files[0] })}
            />
        </div>

        <div className="form-group mt-3">
          <label className='fw-700 text-first'>
            Latitud:
          </label>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Latitud"
            value={latitude || ''}
            readOnly
          />
        </div>

        <div className="form-group mt-3">
          <label className='fw-700 text-first'>
            Longitud:
          </label>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Longitud"
            value={longitude || ''}
            readOnly
          />
        </div>

        <div className="form-group mt-3">
          <label className='fw-700 text-first'>
            Ubicación:
          </label>
          <MapComponent
            location={location}
            onMapClick={this.handleMapClick}
          />
        </div>

        <div className='text-center mt-4'>
          <button className='btn btn-success text-light fw-700' onClick={this.handleSubmit}> Publicar <i className='feather-send'></i></button>
        </div>
      </div>
    );
  }

  renderAdoptionForm() {
    const { pets, selectedPet, petDescriptionAdoption, petImage } = this.state;

    const petOptions = pets.map(pet => ({
      value: pet._id,
      label: `${pet.name} - ${pet.breed}`
    }));

    return (
      <div className='form'>
        <div className='form-group mt-3'>
          <label className='fw-700 text-first'>
            Mascota:
          </label>
          <Select
            required
            placeholder="Selecciona:"
            value={selectedPet}
            onChange={this.handlePetChange}
            options={petOptions}
          />
        </div>


        <div className='text-center mt-4'>
          <button className='btn btn-secondary' onClick={this.generatePostAdoption}>Generar publicación <i className='feather-loader'></i></button>
        </div>

        <div className='form-group mt-3'>
          <label className='fw-700'>Descripción:</label>
          <div className='d-flex justify-content-around border rounded p-2'>
            <div className='col border rounded m-2'>
              {petImage && <img width={150} src={petImage} alt='Mascota' />}
            </div>
            <div className='col border rounded m-2 p-2'>
              <p>{petDescriptionAdoption}</p>
            </div>
          </div>
        </div>

        <div className='text-center mt-4'>
          <button className='btn btn-success text-light fw-700' onClick={this.handleSubmit}> Publicar <i className='feather-send'></i></button>
        </div>
      </div>
    );
  }

  render() {
    const { postType } = this.state;

    return (
      <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
        <div className="alert alert-grey">
          <label className='fw-700 text-first'>
            Tipo de publicación:
          </label>
          <Select
            className='mt-2'
            value={postType}
            onChange={this.handlePostTypeChange}
            placeholder="Seleccione:"
            options={[
              { value: 'Perdida', label: 'Pérdida' },
              { value: 'Avistamiento', label: 'Avistamiento' },
              { value: 'Adopcion', label: 'Adopcion' }
            ]}
          />

          {postType && postType.value === 'Perdida' && this.renderLostForm()}
          {postType && postType.value === 'Avistamiento' && this.renderSightingForm()}
          {postType && postType.value === 'Adopcion' && this.renderAdoptionForm()}

        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    );
  }
}

export default Createpost;
