import React, { Component , Fragment } from "react";


class Forgot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '', // Estado para almacenar el correo electrónico ingresado por el usuario
            phone: ''  // Estado para almacenar el número de teléfono ingresado por el usuario
        };
    }

    andleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { email, phone } = this.state;
        try {
            // Realiza una solicitud POST al nuevo endpoint de reseteo de contraseña
            const response = await axios.post(`http://localhost:5005/api/v1/auth/resetPassword`, { email, phone });
            console.log(response.data); // Imprime la respuesta en la consola
            // Muestra un mensaje de éxito o realiza alguna otra acción en tu aplicación
        } catch (error) {
            console.error("Error al enviar la solicitud: ", error);
            // Muestra un mensaje de error o realiza alguna otra acción en tu aplicación
        }
    }

    render() {
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
                        <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                        style={{backgroundImage: `url("https://i.pinimg.com/564x/49/21/7b/49217bb2a6141dbfbcd6057b7f70064d.jpg")`}}></div>

                        <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                            <div className="card shadow-none border-0 ms-auto me-auto login-card">
                                <div className="card-body rounded-0 text-left">
                                    <h2 className="fw-700 display1-size display2-md-size mb-4">Olvidaste tu  <br />clave</h2>                        
                                    <form>

                                        <div className="alert alert-info">
                                            <spam className="fw-700 "> Ingresa el correo con el que regularmente inicias sesión,
                                                si el correo existe en nuestra base de datos, podrás actualizar tu clave sin problema.
                                            </spam>

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


                                        </div>
                                        
                                        <div className="form-check text-left mb-3">
<input 
                                type="tel" 
                                className="style2-input ps-5 form-control text-grey-900 font-xss ls-3" 
                                placeholder="Número de teléfono" 
                                name="phone"
                                value={phone} 
                                onChange={this.handleInputChange} 
                                required 
                            />
                            <i className="font-sm ti-mobile text-grey-500 pe-0"></i>                                            <label className="form-check-label font-xsss text-grey-500">Accept Term and Conditions</label>
                                        </div>
                                    </form>
                                    
                                    <div className="col-sm-12 p-0 text-left">
                                        <div className="form-group mb-1"><a href="/login" className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">Change Password</a></div>
                                        
                                    </div>
                                    
                                </div>
                            </div> 
                        </div>
                        
                    </div>

                </div>
            </Fragment>
        );
    }
}

export default Forgot;