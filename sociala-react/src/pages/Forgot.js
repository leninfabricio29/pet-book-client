import React, { Component, Fragment } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            phone: ''
        };
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { email, phone } = this.state;
        try {
            const response = await axios.post(`http://localhost:3010/api/v1/auth/resetPassword`, { email, phone }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                toast.success("Revisa tu número de teléfono, se ha reseteado tu clave");
            } else {
                toast.error("Hubo un problema al intentar restablecer tu clave.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    

    render() {
        const { email, phone } = this.state;
        return (
            <Fragment>
                <div className="main-wrap">
                    <div className="nav-header bg-transparent shadow-none border-0">
                        <div className="nav-top w-100">
                            <a href="/"><i className="feather-zap text-success display1-size me-2 ms-0"></i><span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">Petbook. </span> </a>
                            <button className="nav-menu me-0 ms-auto"></button>
                            <a href="/login" className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl">Ingresar</a>
                            <a href="/register" className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl">Registrar</a>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat" style={{ backgroundImage: `url("https://i.pinimg.com/564x/49/21/7b/49217bb2a6141dbfbcd6057b7f70064d.jpg")`}}></div>
                        <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                            <div className="card shadow-none border-0 ms-auto me-auto login-card">
                                <div className="card-body rounded-0 text-left">
                                    <h2 className="fw-700 display1-size display2-md-size mb-4">Olvidaste tu  <br />clave</h2>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="alert alert-info">
                                            <span className="fw-700 "> Ingresa el correo con el que regularmente inicias sesión, si el correo existe en nuestra base de datos, podrás actualizar tu clave sin problema.</span>
                                        </div>
                                        <div className="form-group icon-input mb-3">
                                            <input
                                                type="email"
                                                className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                                                placeholder="Correo electrónico"
                                                name="email"
                                                value={email}
                                                onChange={this.handleInputChange}
                                                required
                                            />
                                            <i className="font-sm ti-email text-grey-500 pe-0"></i>
                                        </div>
                                        <div className="form-group icon-input mb-3">
                                        <input
                                                type="text"
                                                className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                                                placeholder="+593989703847"
                                                name="phone"
                                                value={phone}
                                                onChange={this.handleInputChange}
                                                required
                                            />
                                            <i className="font-sm feather-phone text-grey-500 pe-0"></i>

                                        
      
                                        </div>
                                        <div className="form-check text-left mb-3">
                                            <input required type="checkbox" className="form-check-input mt-2" id="exampleCheck4" />
                                            <label className="form-check-label font-xsss text-grey-500">Aceptar Términos y Condiciones</label>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Resetear Contraseña</button>
                                    </form>
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

export default Forgot;
