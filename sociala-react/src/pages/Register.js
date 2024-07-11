import React, { useState } from 'react';
import { Fragment } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    ci: '',
    username: '',
    email: '',
    password: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasDigit: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'password') {
      validatePassword(e.target.value);
    }
  };

  const validatePassword = (password) => {
    setPasswordErrors({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasDigit: /[0-9]/.test(password),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3010/api/v1/users/new', formData);
      console.log(response.data.message)
      toast.success(response.data.message)
    } catch (error) {
        if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.error('Ha ocurrido un error al intentar crear el usuario.');
          }
    }
  };

  const isPasswordValid = passwordErrors.minLength && passwordErrors.hasUppercase && passwordErrors.hasDigit;


  return (
    
    <Fragment> 
      <div className="main-wrap">
        <div className="nav-header bg-transparent shadow-none border-0">
          <div className="nav-top w-100">
            <a href="/"><i className="feather-zap text-success display1-size me-2 ms-0"></i><span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">PetBook. </span> </a>
            <button className="nav-menu me-0 ms-auto"></button>
            <a href="/" className="header-btn d-none d-lg-block bg-primary fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl">Ingresar</a>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
style={{backgroundImage: `url("https://i.pinimg.com/564x/49/21/7b/49217bb2a6141dbfbcd6057b7f70064d.jpg")`}} ></div>
          <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
            <div className="card shadow-none border-0 ms-auto me-auto login-card">
              <div className="card-body rounded-0 text-left">
                  <h1 className='text-darck text-center'>Crea una cuenta </h1>
                <form onSubmit={handleSubmit}>
                  <p>Datos personales: </p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group icon-input mb-3">
                        <i className="text-grey-500 pe-0"></i>
                        <input required name='name' type="text" className="style2-input ps-4 form-control text-grey-900 font-xsss fw-600" placeholder="Nombre" 
                               value={formData.name} 
                               onChange={handleChange}
                        />                        
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group icon-input mb-3">
                        <i className="text-grey-500 pe-0"></i>
                        <input required name='last_name' type="text" className="style2-input ps-4 form-control text-grey-900 font-xsss fw-600" placeholder="Apellido" 
                               value={formData.last_name}
                               onChange={handleChange}
                        />                        
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group icon-input mb-3">
                        <i className="text-grey-500 pe-0"></i>
                        <input required name='ci' type="number" className="style2-input ps-4 form-control text-grey-900 font-xsss fw-600" placeholder="Cédula"
                               value={formData.ci}
                               onChange={handleChange}
                        />                        
                      </div>
                    </div>
                  </div>
                  <p>Datos de la cuenta: </p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group icon-input mb-3">
                        <i className="text-grey-500 pe-0"></i>
                        <input  required name='email' type="email" className="style2-input ps-4 form-control text-grey-900 font-xsss fw-600" placeholder="Email" 
                               value={formData.email}
                               onChange={handleChange}
                        />                        
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group icon-input mb-3">
                        <i className="text-grey-500 pe-0"></i>
                        <input  required name='username' type="text" className="style2-input ps-4 form-control text-grey-900 font-xsss fw-600" placeholder="Usuario" 
                               value={formData.username}
                               onChange={handleChange}
                        />                        
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group icon-input mb-3">
                        <i className="text-grey-500 pe-0"></i>
                        <input required name='password' type="password" className="style2-input ps-4 form-control text-grey-900 font-xsss fw-600" placeholder="Clave" 
                               value={formData.password}
                               onChange={handleChange}
                        />                        
                      </div>
                    </div>
                    <div className="col alert alert-warning" style={{fontSize: "9px"}}>
                      <ul>
                        <li style={{ color: passwordErrors.minLength ? 'green' : 'red' }}>La contraseña debe tener al menos 8 caracteres.</li>
                        <li style={{ color: passwordErrors.hasUppercase ? 'green' : 'red' }}>La contraseña debe contener al menos una letra mayúscula.</li>
                        <li style={{ color: passwordErrors.hasDigit ? 'green' : 'red' }}>La contraseña debe contener al menos un número.</li>
                      </ul>
                    </div>
                  </div>
                  <button type="submit" className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 " disabled={!isPasswordValid} >Registrarte</button>
                </form>
                <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Si ya tienes cuenta,  <a href="/login" className="fw-700 ms-1">Ingresa</a></h6>
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

    </Fragment>
  );
};

export default RegisterForm;
