import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';

class DetailPets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pet: null,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchPetDetails();
    }

    fetchPetDetails = async () => {
        const { id } = this.props.match.params;

        try {
            const response = await axios.get(`http://localhost:3010/api/v1/pets/${id}`);
            this.setState({ pet: response.data.pet, isLoading: false });
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
        }
    }

    render() {
        const { pet, isLoading, error } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>{error}</p>;
        }

        if (!pet) {
            return <p>No pet details available</p>;
        }

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
                                        <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Mis mascotas / Detalle / {pet.name}</h4>
                                    </div>

                                    <div className="row ps-2 pe-2 justify-content-center align-items-center">
                                        <div className="col-md-6 col-sm-6 pe-2 ps-2">
                                            <div className="card d-block m-2 border-0 shadow-xss rounded-3 overflow-hidden mb-2 bg-lightblue">
                                                <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                                                    <h4 className="fw-700 font-xsss mt-3 mb-3">Detalles de la mascota</h4>
                                                    <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                                                        <img src={pet.photo_url} alt="avatar" className="float-right p-0 bg-white rounded-circle w-100 shadow-xss" />
                                                    </figure>
                                                    <div className="clearfix w-100">
                                                        <div className="row mt-4">
                                                            <div className="col-md-6 text-left">
                                                                <p className="mb-1"><strong>Raza:</strong> {pet.breed}</p>
                                                                <p className="mb-1"><strong>Sexo:</strong> {pet.sex}</p>
                                                                <p className="mb-1"><strong>Tamaño:</strong> {pet.size}</p>
                                                                <p className="mb-1"><strong>Color:</strong> {pet.color}</p>
                                                                <p className="mb-1"><strong>Edad:</strong> {pet.age} años</p>
                                                            </div>
                                                            <div className="col-md-6 text-left">
                                                                <p className="mb-1"><strong>Nombre:</strong> {pet.name}</p>
                                                                <p className="mb-1"><strong>Enfermedades:</strong> {pet.has_disease ? 'Sí' : 'No'}</p>
                                                                <p className="mb-1"><strong>Tratamientos:</strong> {pet.requires_treatment ? 'Sí' : 'No'}</p>
                                                                <p className="mb-1"><strong>Esterilización:</strong> {pet.sterilization_status ? 'Sí' : 'No'}</p>
                                                                <p className="mb-1"><strong>Estado:</strong> <span className="text-success">{pet.status ? 'Habilitada' : 'Deshabilitada'}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
            </Fragment>
        );
    }
}

export default DetailPets;
