import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const history = useHistory();

    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        
        try {
            const response = await axios.post('http://localhost:3010/api/v1/auth/login', formData);
            
            const { token, user } = response.data;

            // Guardar token y datos del usuario en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log(user.rol)

            if(user.rol === "usuario" || user.rol === "fundacion"){
                if(user.status_profile){
                    history.push('/home')
                }else{
                    history.push('/welcome');
    
                }
            }else{
                console.log("Es administrador")
                
                history.push('/admin');
            }

            
            // Redirigir al usuario a /home
            
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error('No existe usuario registrado con el correo que haz proporcionado.');
                } else if (error.response.status === 401) {
                    toast.error('La contraseña proporcionada es incorrecta.');
                
                } else {
                    toast.error('El servicio de autenticación no se encuentra disponible.');
                }
            } else {
                toast.error('Ha ocurrido un error al conectar con el servidor.');
            }
        }
    };

        
        
               

    return (
        <div className="main-wrap">
            <div className="nav-header bg-transparent shadow-none border-0">
                <div className="nav-top w-100">
                    <a href="/"><i className="feather-zap text-success display1-size me-2 ms-0"></i><span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">PetBook. </span> </a>
                    <button className="nav-menu me-0 ms-auto"></button>
                    <a href="/register" className="header-btn d-none d-lg-block bg-primary fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl">Registrate</a>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                    style={{ backgroundImage: `url("https://i.pinimg.com/564x/49/21/7b/49217bb2a6141dbfbcd6057b7f70064d.jpg")` }}></div>
                <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                    <div className="card shadow-none border-0 ms-auto me-auto login-card">
                        <div className="card-body rounded-0 text-left">
                            <div className="alert alert-success">
                                <p>Bienvenido a petbook, un lugar para para conocer datos sobre las mascotas y donde podrás reportar si tu amigo peludo se llega a perder</p>
                            </div>
                            <h3 className="text-dark">Ingresa los datos de tu cuenta </h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group icon-input mb-3">
                                    <i className="text-grey-500 pe-0"></i>
                                    <input required name="email" type="email" className="style2-input ps-4 form-control text-grey-900 font-xsss fw-600" placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange} />
                                </div>
                                <div className="form-group icon-input mb-1">
                                    <input required type="password" className="style2-input ps-4 form-control text-grey-900 font-xss ls-3" placeholder="Clave" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange} />
                                    <i className="text-grey-500 pe-0"></i>
                                </div>
                                <div className="form-check  mb-3">
                                    <a href="/forgot" className="fw-600 font-xsss text-grey-700 mt-1 float-right">Olvidaste la clave?</a>
                                </div>
                                <div className="col-sm-12 p-0 text-left">
                                    <div className="form-group mb-1">
                                        <button type="submit" className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">Ingresar</button>
                                    </div>
                                    <div className="alert alert-danger">
                                <p>Si previamente iniciaste sesión, haz click aquí : <a href="http://localhost:3000/home">PetBook | Inicio</a></p>
                            </div>
                                </div>
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
    );
}

export default Login;
