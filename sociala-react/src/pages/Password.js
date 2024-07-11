import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify'
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';

class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            newPassword: '',
            confirmPassword: '',
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const {newPassword, confirmPassword, email } = this.state;

        const user = JSON.parse(localStorage.getItem('user'));
        
                 

        if (newPassword !== confirmPassword) {
            toast.warning("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3010/api/v1/users/${user.email}/updatePassword`, {password: newPassword});

            if (response.status === 200) {
                toast.success(response.data.message, "debes volver a iniciar sesión");
                setTimeout(() => {
                    this.props.history.push('/');
                }, 3000); 
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    render() {
        const { newPassword, confirmPassword } = this.state;

        return (
            <Fragment>
                <div className="main-wrapper">
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
                                            <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Actualizar clave</h4>
                                        </div>
                                        <div className="card-body p-lg-5 p-4 w-100 border-0">
                                            <div className="alert alert-success">
                                                <span>Si actualizas tu clave, deberás volver a iniciar sesión</span>
                                            </div>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className="row">
                                                    <div className="col-lg-12 mb-3">
                                                        
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Nueva clave</label>
                                                            <input 
                                                            required
                                                                type="password" 
                                                                name="newPassword" 
                                                                className="form-control" 
                                                                value={newPassword} 
                                                                onChange={this.handleChange} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-12 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Confirma nueva clave</label>
                                                            <input 
                                                            required
                                                                type="password" 
                                                                name="confirmPassword" 
                                                                className="form-control" 
                                                                value={confirmPassword} 
                                                                onChange={this.handleChange} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 mb-0">
                                                        <button type="submit" className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block">Actualizar</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
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
            </Fragment>
        );
    }
}

export default Password;
