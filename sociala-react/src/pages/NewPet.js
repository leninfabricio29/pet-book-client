import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import { Switch, Tooltip } from "@mui/material";
import { Hourglass } from 'react-loader-spinner'; // Import the loader

import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import {dataBreeds} from '../utils/dataBreeds';

class NewPet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: '',
            user: null,
            type: '',
            otherType: '',
            name: '',
            breed: '',
            sex: '',
            age: '',
            size: '',
            color: '',
            has_disease: false,
            requires_treatment: false,
            sterilization_status: false,
            disease_description: '',
            treatment_description: '',
            photo_profile: null,
            status: '',
            owner: '',
            loading: false, // Loading state
            showAddBreedInput: false,
            newBreed: '',
            breedOptions: {
                Perro: dataBreeds.perros.map(breed => ({ value: breed.nombre, label: breed.nombre })),
                Gato: dataBreeds.gatos.map(breed => ({ value: breed.nombre, label: breed.nombre }))
            }// Initialize breed options here
        };
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.setState({ user });
        } else {
            this.props.history.push('/');
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleFileChange = (e) => {
        this.setState({ [e.target.name]: e.target.files[0] });
    }

    handleCheckboxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    }

    handleSelectChange = (name, selectedOption) => {
        this.setState({ [name]: selectedOption.value });
    }

    addNewBreed = () => {
        const { newBreed, type, breedOptions } = this.state;
        if (newBreed.trim() === '') {
            toast.error('El nombre de la nueva raza no puede estar vacío.');
            return;
        }

        const updatedBreedOptions = {
            ...breedOptions,
            [type]: [...(breedOptions[type] || []), { value: newBreed, label: newBreed }]
        };

        this.setState({
            breedOptions: updatedBreedOptions,
            breed: newBreed,
            showAddBreedInput: false,
            newBreed: ''
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true }); // Start loading

        const user = JSON.parse(localStorage.getItem('user'));
        const ownerId = user._id;

        const { type, name, breed, sex, age, size, color, has_disease, requires_treatment, sterilization_status, disease_description, treatment_description, photo_profile } = this.state;

        const formData = new FormData();
        formData.append('type', type);
        formData.append('name', name);
        formData.append('breed', breed);
        formData.append('sex', sex);
        formData.append('age', age);
        formData.append('size', size);
        formData.append('color', color);
        formData.append('has_disease', has_disease);
        formData.append('disease_description', disease_description);
        formData.append('requires_treatment', requires_treatment);
        formData.append('treatment_description', treatment_description);
        formData.append('sterilization_status', sterilization_status);
        formData.append('photo_profile', photo_profile);
        formData.append('owner', ownerId);


        try {
            const response = await axios.post('http://localhost:3010/api/v1/pets/new', formData);
            this.props.history.push("/defaultpets");

            toast.info('Datos Guardados !');
        } catch (error) {
            toast.error('Error en el formulario: ' + error.message);
        } finally {
            this.setState({ loading: false }); // Stop loading
        }
    };

    render() {
        const { type, name, breed, sex, age, size, color, has_disease, requires_treatment, sterilization_status, disease_description, treatment_description, loading } = this.state;

        const petTypeOptions = [{ value: 'Perro', label: 'Perro' }, { value: 'Gato', label: 'Gato' }, { value: 'Otro', label: 'Otro' }];
        const sexOptions = [{ value: 'Macho', label: 'Macho' }, { value: 'Hembra', label: 'Hembra' }];
        const sizeOptions = [{ value: 'Pequeño', label: 'Pequeño' }, { value: 'Mediano', label: 'Mediano' }, { value: 'Grande', label: 'Grande' }];

        return (
            <Fragment>
                <Header />
                <Leftnav />
                <Rightchat />

                <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left">
                            <div className="middle-wrap">
                                <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                                    <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                        <Link to="/defaultpets" className="d-inline-block mt-2">
                                            <i className="ti-arrow-left font-sm text-white"></i>
                                        </Link>
                                        <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">
                                            Mis mascotas / Nuevo registro
                                        </h4>
                                    </div>

                                    <div className="row ps-2 pe-2 justify-content-center align-items-center">
                                        <div className="text-first mt-4">
                                            <Tooltip title="Ver ayuda">
                                            <button className="btn btn-info mx-4" data-bs-toggle="modal" data-bs-target="#modalInfo"> <i className="feather-help-circle"></i></button>

                                            </Tooltip>

                                        </div>

                                        <div className="modal fade" id="modalInfo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header bg-secondary ">
        <h5 className="modal-title text-light" id="exampleModalLabel" >Información</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
       <spam className="fw-700 font-xsss ">Si no existe el tipo de mascota, elige otro y escribe en el cuadro el nuevo tipo de mascota.
       <br/>

       Si no existe la raza, registra una nueva, guarda los nuevo datos, automaticamente la nueva raza se cargará.</spam> 
                
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Entendido !</button>
      </div>
    </div>
  </div>
</div>
                                        <div className="text-center mt-4 mb-2">
                                            
                                            <h4>Detalles de tu mascota</h4>
                                        </div>

                                        <div style={{ maxWidth: "750px" }}>
                                            <div className="select-wrapper">
                                                {loading ? (
                                                    <div className="text-center">
                                                        <Hourglass
                                                            visible={true}
                                                            height="80"
                                                            width="80"
                                                            ariaLabel="hourglass-loading"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            colors={['#306cce', '#72a1ed']}
                                                        />
                                                        <p>Validando los datos...</p>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={this.handleSubmit}>
                                                        <div className="row g-3 mb-3">
                                                            <div className="col-sm">
                                                                <label>Tipo de mascota:</label>
                                                                <Select
                                                                    required
                                                                    value={type ? { value: type, label: type } : null}
                                                                    onChange={(selectedOption) => this.handleSelectChange('type', selectedOption)}
                                                                    options={petTypeOptions}
                                                                    placeholder="Seleccione:"
                                                                />
                                                                {type === 'Otro' && (
                                                                    <div className="mt-2">
                                                                        <input
                                                                            required
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="otherType"
                                                                            value={this.state.otherType || ''}
                                                                            placeholder="Especifique el tipo"
                                                                            onChange={this.handleChange}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-sm">
                                                                <label>Raza:</label>
                                                                <div className="d-flex">
                                                                    <Select
                                                                    required
                                                                        value={breed ? { value: breed, label: breed } : null}
                                                                        onChange={(selectedOption) => this.handleSelectChange('breed', selectedOption)}
                                                                        options={this.state.breedOptions[type] || []}
                                                                        placeholder="Seleccione:"
                                                                    />

                                                                    <Tooltip title="Crear nueva raza">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-secondary mx-2"
                                                                        onClick={() => this.setState({ showAddBreedInput: true })}
                                                                    >
                                                                        <i className="feather-plus"></i>
                                                                    </button>
                                                                    </Tooltip>
                                                                   
                                                                </div>
                                                                {this.state.showAddBreedInput && (
                                                                    <div className="mt-2 d-flex">
                                                                        <input
                                                                        required
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="newBreed"
                                                                            value={this.state.newBreed || ''}
                                                                            placeholder="Ingrese nueva raza"
                                                                            onChange={this.handleChange}
                                                                        />

                                                                       <Tooltip title="Guardar nueva raza">
                                                                       <button
                                                                            type="button"
                                                                            className="btn btn-info m-2 text-light " 
                                                                            onClick={this.addNewBreed}
                                                                        >
                                                                            <i className="feather-save"></i>
                                                                        </button>
                                                                        </Tooltip> 
                                                                       
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-sm">
                                                                <label>Sexo:</label>
                                                                <Select
                                                                    required
                                                                    value={sex ? { value: sex, label: sex } : null}
                                                                    onChange={(selectedOption) => this.handleSelectChange('sex', selectedOption)}
                                                                    options={sexOptions}
                                                                    placeholder="Seleccione: "
                                                                />
                                                                                                                       </div>
                                                        </div>

                                                        <div className="row g-3 mb-3">
                                                            <div className="col-md-3">
                                                                <label>Nombre:</label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    className="form-control"
                                                                    name="name"
                                                                    value={name}
                                                                    placeholder="Ejemplo: Zeus"
                                                                    onChange={this.handleChange}
                                                                />
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label>Edad: </label>
                                                                <Tooltip title="Debe ser en meses">
                                                                <i className="mx-2 feather-help-circle bg-secondary rounded p-1 text-light"></i> 

                                                                </Tooltip>
                                                                <input
                                                                    type="number"
                                                                    required
                                                                    className="form-control"
                                                                    name="age"
                                                                    value={age}
                                                                    onChange={this.handleChange}
                                                                    placeholder="18 "
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label>Color:</label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    className="form-control"
                                                                    name="color"
                                                                    value={color}
                                                                    onChange={this.handleChange}
                                                                    placeholder="Ejemplo: Café y manchas blancas"
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Tamaño:</label>
                                                                <Select
                                                                    required
                                                                    value={size ? { value: size, label: size } : null}
                                                                    onChange={(selectedOption) => this.handleSelectChange('size', selectedOption)}
                                                                    options={sizeOptions}
                                                                    placeholder="Seleccione:"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row g-3 mb-3">
                                                            <div className="col-sm">
                                                                <label>Enfermedades:</label>
                                                                <br />
                                                                <span>No</span>
                                                                <Switch
                                                                    color="success"
                                                                    name="has_disease"
                                                                    checked={has_disease}
                                                                    onChange={this.handleCheckboxChange}
                                                                />
                                                                <span>Sí</span>
                                                                {has_disease && (
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="disease_description"
                                                                            value={disease_description}
                                                                            placeholder="Describa la enfermedad"
                                                                            onChange={this.handleChange}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-sm">
                                                                <label>Tratamientos:</label>
                                                                <br />
                                                                <span>No</span>
                                                                <Switch
                                                                    color="success"
                                                                    name="requires_treatment"
                                                                    checked={requires_treatment}
                                                                    onChange={this.handleCheckboxChange}
                                                                />
                                                                <span>Sí</span>
                                                                {requires_treatment && (
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="treatment_description"
                                                                            value={treatment_description}
                                                                            placeholder="Describa el tratamiento"
                                                                            onChange={this.handleChange}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-sm">
                                                                <label>Esterilización:</label>
                                                                <br />
                                                                <span>No</span>
                                                                <Switch
                                                                    color="success"
                                                                    name="sterilization_status"
                                                                    checked={sterilization_status}
                                                                    onChange={this.handleCheckboxChange}
                                                                />
                                                                <span>Sí</span>
                                                            </div>
                                                        </div>

                                                        <div className="row g-3 mb-3">
                                                            <div className="col-md-6">
                                                                <label>Fotografía:</label>
                                                                <input
                                                                    type="file"
                                                                    required
                                                                    className="form-control"
                                                                    name="photo_profile"
                                                                    onChange={this.handleFileChange}
                                                                    placeholder="Sin archivos"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="text-center p-4">
                                                            <button type="submit" className="btn btn-info">Guardar Datos</button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Popupchat />
                <Appfooter />
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
            </Fragment>
        );
    }
}

export default NewPet;

