import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Switch } from "@mui/material";
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

class Createpost extends Component {
  state = {
    isOpen: false,
    postType: null,
    pets: [],
    selectedPet: null,
    rewardToggle: false,
    location: null,
    petDescription: '',
    latitude: null,
    longitude: null,
    petImage: ''
  };

  componentDidMount() {
    this.fetchPets();
  }

  fetchPets = async () => {
    try {
      const response = await axios.post('http://localhost:5010/api/v1/pets/search', {
        owner: JSON.parse(localStorage.getItem('user'))._id
      });

      // Filtrar las mascotas con status true
      const petsWithTrueStatus = response.data.filter(pet => pet.status === true);

      // Actualizar el estado con las mascotas filtradas
      this.setState({ pets: petsWithTrueStatus });

      console.log(this.state.pets);
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
    this.setState({ petDescription: event.target.value });
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
      const petDescription = `Hola, me llamo ${pet.name}. Tengo ${pet.age} meses de edad, soy de tamaño ${pet.size}, y me reconocerás por mi color ${pet.color}. Si me ves, por favor contacta a mi dueño. Recompensa: ${rewardToggle ? 'Sí' : 'No'}.`;
      this.setState({
        petDescription,
        petImage: pet.photo_url
      });
    }
  }

  handleSubmit = async () => {
    const { postType, selectedPet, rewardToggle, latitude, longitude, petDescription } = this.state;
    const { _id: owner } = JSON.parse(localStorage.getItem('user'));

    if (!selectedPet) {
      toast.error("Por favor selecciona una mascota.");
      return;
    }

    const petId = selectedPet.value;

    console.log("Este es el ide de la mascota",petId);

    try {
      await axios.post('http://localhost:5020/api/v1/posts/new', {
        type: postType.value,
        body: petDescription,
        coordinates: [longitude, latitude],
        reward: rewardToggle ? 1 : 0,
        owner,
        pet: petId
      });

      toast.success("Publicación creada correctamente");
    } catch (error) {
      toast.error('Error al crear la publicación.');
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
          <LoadScript
            googleMapsApiKey="AIzaSyCbI4nMuWwVI8gRXK0Q9NumVr08ItvolIg "
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={14}
              center={location || { lat: -3.994837599441174, lng: -79.20580382951684 }}
              onClick={this.handleMapClick}
            >
              {location && <Marker position={location} />}
            </GoogleMap>
          </LoadScript>
        </div>
        <div className='text-center mt-4'>
          <button className='btn btn-success text-light fw-700' onClick={this.handleSubmit}> Publicar <i className='feather-send'></i></button>
        </div>
      </div>
    );
  }

  renderSightingForm() {
    const { petDescription } = this.state;

    return (
      <div className='form-group mt-3'>
        <label className='fw-700 text-first'>
          Descripción de la mascota:
        </label>
        <textarea
          className="form-control mt-2"
          placeholder="Descripción de la mascota"
          value={petDescription}
          onChange={this.handlePetDescriptionChange}
        ></textarea>
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
              { value: 'Avistamiento', label: 'Avistamiento' }
            ]}
          />

          {postType && postType.value === 'Perdida' && this.renderLostForm()}
          {postType && postType.value === 'Avistamiento' && this.renderSightingForm()}
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
