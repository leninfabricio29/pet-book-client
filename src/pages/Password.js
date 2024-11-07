import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import PasswordChecklist from "react-password-checklist";
import 'react-toastify/dist/ReactToastify.css';

class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: '',
            confirmPassword: '',
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { newPassword, confirmPassword } = this.state;
        const user = JSON.parse(localStorage.getItem('user'));

        if (newPassword !== confirmPassword) {
            toast.warning("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3010/api/v1/users/${user.email}/updatePassword`, { password: newPassword });

            if (response.status === 200) {
                toast.success(response.data.message, "debes volver a iniciar sesión");
                setTimeout(() => {
                    this.props.history.push('/');
                }, 3000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al actualizar la contraseña");
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
                                                <div className="form-group">
                                                    <label>Nueva contraseña:</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={newPassword}
                                                        onChange={this.handleChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Confirmar contraseña:</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={this.handleChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                                <PasswordChecklist
                                                    rules={["minLength", "specialChar", "number", "capital", "match"]}
                                                    minLength={8}
                                                    value={newPassword}
                                                    valueAgain={confirmPassword}
                                                    messages={{
                                                        minLength: "La contraseña tiene más de 8 caracteres.",
                                                        specialChar: "La contraseña tiene caracteres especiales.",
                                                        number: "La contraseña tiene un número.",
                                                        capital: "La contraseña tiene una letra mayúscula.",
                                                        match: "Las contraseñas coinciden.",
                                                    }}
                                                />
                                                <button type="submit" className="btn btn-primary mt-3">Actualizar clave</button>
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
