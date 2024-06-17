import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import { toast, ToastContainer } from "react-toastify";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            profile: null,
            number_phone: '',
            photo_profile: '',
            photo_cover: '',
            word_description: '',
            description: ''
        };
    }

    async componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.setState({ user });
            try {
                const profileResponse = await axios.get(`http://localhost:5000/api/v1/profiles/${user._id}`);
                const { data } = profileResponse;

                console.log("Estos es lo que hay en data", data);

                this.setState({
                    profile: data,
                    number_phone: data.number_phone,
                    photo_profile: data.photo_profile,
                    photo_cover: data.photo_cover,
                    word_description: data.word_description,
                    description: data.description
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        } else {
            this.props.history.push('/login');
        }
    }

  

    

    render() {
        const { user, profile } = this.state;

        console.log("En render"+profile)

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
                                        <Link to="/defaultsettings" className="d-inline-block mt-2">
                                            <i className="ti-arrow-left font-sm text-white"></i>
                                        </Link>
                                        <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Detalles de la cuenta</h4>
                                    </div>
                                    <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-4 text-center">
                                                <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                                                    <img src={profile && profile.profile.photo_profile_url} alt="avatar" className="shadow-sm rounded-3 w-100" />
                                                </figure>
                                                <h2 className="fw-700 font-sm text-grey-900 mt-3">
                                                    {user ? `${user.name} ${user.last_name}` : 'Usuario'}
                                                </h2>
                                                <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">Loja-Ecuador</h4>
                                            </div>
                                        </div>
                                        <div className="container border p-4">
                                            <div className="text-first">
                                                <h4 className="h4 text-grey">Datos de la cuenta</h4>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Nombre</label>
                                                        <input disabled type="text" className="form-control" value={user ? `${user.name}` : 'Usuario'} />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Apellido</label>
                                                        <input disabled type="text" className="form-control" value={user ? `${user.last_name}` : 'Usuario'} />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Cédula de indetidad</label>
                                                        <input disabled type="text" className="form-control" value={user ? `${user.ci}` : 'Usuario'} />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Nombre de usuario</label>
                                                        <input disabled type="text" className="form-control" value={user ? `${user.username}` : 'Usuario'} />
                                                    </div>
                                                </div>
                                                </div>

                                                <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Email</label>
                                                        <input disabled type="text" className="form-control" value={user ? `${user.email}` : 'Usuario'} />
                                                    </div>
                                                </div>

                                                
                                                </div>
                                                
                                            </div>
                                        </div>

                                        <div className="container border p-4 mt-4">
                                            <div className="text-first">
                                                <h4 className="h4 text-grey">Datos de la Perfil</h4>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Número de contacto</label>
                                                        <input disabled type="text" className="form-control" value={profile ? `0${profile.profile.number_phone}` : 'Usuario'} />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Palabra descriptiva</label>
                                                        <input disabled type="text" className="form-control" value={profile ? `${profile.profile.word_description}` : 'Usuario'} />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss mb-2">Descripción</label>
                                                        <textarea disabled type="text"  className="form-control mb-0 p-3 h100 bg-greylight lh-16" rows="5" name="description" value={profile ? `${profile.profile.description}` : 'Usuario'} />
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

export default Account;
