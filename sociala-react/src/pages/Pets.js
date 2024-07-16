import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import { Tooltip } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class Pets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pets: [],
            isLoading: true,
            error: null,
            filter: 'all' // Agregar estado del filtro
        };
    }

    componentDidMount() {
        this.fetchPets();
    }

    fetchPets = async () => {
        try {
            const response = await axios.post('http://localhost:3010/api/v1/pets/search', {
                owner: JSON.parse(localStorage.getItem('user'))._id
            });
            this.setState({ pets: response.data, isLoading: false });
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
        }
    }

    setFilter = (filter) => {
        this.setState({ filter });
    }

    getFilteredPets = () => {
        const { pets, filter } = this.state;
        if (filter === 'enabled') {
            return pets.filter(pet => pet.status);
        } else if (filter === 'disabled') {
            return pets.filter(pet => !pet.status);
        }
        return pets; // 'all' case
    }

    changeStatusPet = async (petId, status) => {
        try {
            const response = await axios.post('http://localhost:5010/api/v1/pets/change', {
                petId,
                status
            });

            console.log(response);

            this.fetchPets(); // Refresh the list of pets

            toast.info("¡Datos actualizados!");

        } catch (error) {
            toast.error("Error interno: " + error.message);
        }
    }

    render() {
        const { isLoading, error, filter } = this.state;
        const filteredPets = this.getFilteredPets();

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
                                        <Link to="/defaultsettings" className="d-inline-block mt-2"><i className="ti-arrow-left font-sm text-white"></i></Link>
                                        <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Mis mascotas</h4>
                                    </div>

                                    <div className="row ps-2 pe-2">
                                        <div>
                                            <div className="text-center mt-2 border rounded p-2">
                                                <span className="font-xsss">Esta sección refleja a tus mascota registradas, puedes ver detalles de tu mascota,
                                                    editar datos, y deshabilitar el registro de tu mascota.
                                                </span>
                                            </div>

                                            <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                                <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">Mascotas
                                                    <form action="#" className="pt-0 pb-0 ms-auto">
                                                        <div className="search-form-2 ms-2">
                                                            <i className="ti-search font-xss"></i>
                                                            <input type="text" className="form-control text-grey mb-0 bg-greylight theme-dark-bg border-2" placeholder="Buscar..." />
                                                        </div>
                                                    </form>
                                                    
                                                    <Tooltip title='Agregar mascota'>
                                                        <Link to="/newpet" className="btn-round-md ms-2 bg-primary theme-dark-bg rounded-3">
                                                            <i className="ti-plus font-xss text-light"></i>
                                                        </Link>
                                                    </Tooltip> 
                                                </h2>
                                            </div>

                                            <div className="d-flex justify-content-around">
                                                <button className={`btn ${filter === 'all' ? 'bg-instagram' : 'bg-grey'} text-light`} onClick={() => this.setFilter('all')}>Todas</button>
                                                <button className={`btn ${filter === 'enabled' ? 'bg-instagram' : 'bg-grey'} text-light`} onClick={() => this.setFilter('enabled')}>Habilitadas <i className="feather-filter"></i> </button>
                                                <button className={`btn ${filter === 'disabled' ? 'bg-instagram' : 'bg-grey'} text-light`} onClick={() => this.setFilter('disabled')}>Deshabilitadas  <i className="feather-filter"></i> </button>
                                            </div>
                                        </div>

                                        {isLoading && <p>Loading...</p>}
                                        {error && <p>{error}</p>}
                                        {!isLoading && !error && (
                                            filteredPets.length > 0 ? (
                                                filteredPets.map((pet, index) => (
                                                    <div key={index} className="col-md-4 col-sm-4 pe-2 ps-2 mt-4">
                                                        <div className="card d-block m-2 border-0 shadow-xss rounded-3 overflow-hidden mb-2 bg-lightblue">
                                                            <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                                                                <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                                                                    <img src={`${pet.photo_url}`} alt="avatar" className="float-right p-0 bg-white rounded-circle w-100 shadow-xss" />
                                                                </figure>
                                                                <div className="clearfix w-100"></div>
                                                                <h4 className="fw-700 font-xsss mt-3 mb-0">{pet.name}</h4>

                                                                <Tooltip title='Ver detalles'>
                                                                    <Link to={`/detailpets/${pet._id}`}>
                                                                        <i className="btn-round-md pointer text-success feather-eye font-md me-3"></i>
                                                                    </Link>
                                                                </Tooltip>
                                                                
                                                                <Tooltip title='Editar registro'>
                                                                    <i className="btn-round-md pointer text-primary feather-edit font-md me-3"></i>
                                                                </Tooltip>

                                                                <Tooltip title='Deshabilitar registro'>
                                                                    <i className="btn-round-md pointer text-danger feather-delete font-md me-3" data-toggle="modal" data-target={`#exampleModal${index}`}></i>
                                                                </Tooltip>

                                                                <div className="modal fade" id={`exampleModal${index}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                                                    <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header text-light">
                                                                                <h5 id="exampleModalLongTitle">Eliminar un registro</h5>
                                                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                    <span aria-hidden="true">&times;</span>
                                                                                </button>
                                                                            </div>
                                                                            <div className="modal-body">
                                                                                <div className="form-group m-2">
                                                                                    <span className="fw-700 font-xsss">¿Estás seguro de eliminar a "{pet.name}"? Recuerda que no podrás publicar nada relacionado a esta mascota.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="modal-footer">
                                                                                <button type="button" className="btn btn-dark" data-dismiss="modal">Cancelar</button>
                                                                                <button type="button" className="btn btn-info" onClick={() => this.changeStatusPet(pet._id, false)}>Continuar</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                
                                                <div className="container">
    <div className="d-flex flex-column align-items-center text-center">
        <div className="alert alert-danger mt-4">
            <i className="feather-x-circle"></i>
            <br />
        <span>No hay datos de mascotas para esta sección</span>


            </div>
    </div>
</div>


                                                
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
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

                <Popupchat />
                <Appfooter />
            </Fragment>
        );
    }
}

export default Pets;
