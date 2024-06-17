import React from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { Modal } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import './Welcome.css';
import Select from "react-select";
import { Tooltip } from '@mui/material';

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            history: '',
            number_phone: '',
            photo_profile: '',
            photo_cover: '',
            word_description: null,
            description: '',
            showModal: false
        };
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.setState({ user });
        } else {
            this.props.history.push('/home');
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleFileChange = (e) => {
        this.setState({ [e.target.name]: e.target.files[0] });
    }

    handleSelectChange = (selectedOption) => {
        this.setState({ word_description: selectedOption });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { user, number_phone, photo_profile, photo_cover, word_description, description } = this.state;

        const formData = new FormData();
        formData.append('user', user._id);
        formData.append('number_phone', number_phone);
        formData.append('photo_profile', photo_profile);
        formData.append('photo_cover', photo_cover);
        formData.append('word_description', word_description ? word_description.value : '');
        formData.append('description', description);

        try {
            const response = await axios.post('http://localhost:5000/api/v1/profiles/new', formData);

            if (response.status === 201) {
                toast.success('Perfil creado exitosamente');
                // Esperar 1 segundo antes de redirigir
                setTimeout(() => {
                    this.props.history.push('/home');
                }, 1000);
                this.setState({ showModal: false });
            } else if (response.status === 404) {
                toast.error('No tienes usuarios');
            }
        } catch (error) {
            toast.error('Error al crear el perfil: ' + error.message);
        }
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    render() {
        const { number_phone, word_description, description, showModal } = this.state;
        const wordTypeOptions = [
            { value: 'Responsable', label: 'Responsable' },
            { value: 'Amoroso', label: 'Amoroso' },
            { value: 'Divertido', label: 'Divertido' }
        ];

        return (
            <div>
                <section className="welcome-section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <img src="https://cdn.pixabay.com/photo/2022/02/01/20/20/animal-6987017_1280.jpg" alt="Welcome Image" className="img-fluid rounded" />
                            </div>
                            <div className="col-lg-6 mt-4 mt-lg-0">
                                <h1 className="display-4 fw-bold m-4">Petbook te da la bienvenida</h1>
                                <p className="lead">
                                    ¡Vamos juntos a crear recuerdos inolvidables con nuestras queridas mascotas!
                                    <br /><br />
                                    Con cariño,
                                    <br />
                                    El equipo de PetBook
                                </p>
                                <div className='alert alert-warning'>
                                    <span>Tu usuario ha sido creado con éxito, pero para poder interactuar en la plataforma debes obligatoriamente crear un perfil.</span>
                                </div>
                                <div className="d-grid gap-2 d-sm-flex justify-content-center mt-4">
                                    <button className="btn btn-info btn-lg me-sm-3 mb-3 mb-sm-0" onClick={this.toggleModal}>Crear Perfil</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Modal show={showModal} onHide={this.toggleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Datos del perfil</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmit}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="form-group">
                                            <label className="mont-font fw-600 font-xsss mb-2">Teléfono de contacto</label>
                                            <input type="number" required className="form-control" name="number_phone" value={number_phone} onChange={this.handleChange} placeholder='09....' />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <div className="form-group">
                                            <label className="mont-font fw-600 font-xsss mb-2">Palabra descriptiva</label>
                                            <Select
                                                required
                                                value={word_description}
                                                onChange={this.handleSelectChange}
                                                options={wordTypeOptions}
                                                placeholder='Seleccione:'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 mb-3">
                                        <label className="mont-font fw-600 font-xsss mb-2 text-dark">Descripción</label>
                                        <textarea required className="form-control mb-0 p-3 h100 bg-greylight lh-16" rows="5" name="description" value={description} onChange={this.handleChange} placeholder='Cuéntanos sobre tu relación con las mascotas a manera de descripción'></textarea>
                                    </div>
                                    <div className="col-lg-12 mb-3">
                                        <label className="mont-font fw-600 font-xsss mb-2 text-dark">Foto perfil</label>
                                        <input required type="file" className="form-control" name="photo_profile" onChange={this.handleFileChange}></input>
                                    </div>
                                    <div className="col-lg-12 mb-3">
                                        <label className="mont-font fw-600 font-xsss mb-2 text-dark">Foto portada</label>
                                        <input required type="file" className="form-control" name="photo_cover" onChange={this.handleFileChange}></input>
                                    </div>
                                    <div className="col-lg-12">
                                        <button className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block">Guardar Cambios</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
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
        )
    }
}

export default Welcome;
