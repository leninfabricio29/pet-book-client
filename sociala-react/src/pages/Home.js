import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import Friends from '../components/Friends';
import Createpost from '../components/Createpost';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: '',
            user: null,
            showForm: false // Agrega el estado para controlar la visibilidad del formulario
        };
    }
    
    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.setState({ user });
        } else {
            // Redirigir a login si no hay usuario en localStorage
            this.props.history.push('/');
        }
    }

    // Manejador de evento para mostrar u ocultar el formulario
    toggleForm = () => {
        this.setState(prevState => ({
            showForm: !prevState.showForm
        }));
    }

    render() {
        const { user, showForm } = this.state;

        return (
            <Fragment> 
                <Header />
                <Rightchat />
                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left">
                            <div className="row feed-body">
                                <div className="col-xl-8 col-xxl-9 col-lg-8">
                                    <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
                                        <div className=" alert alert-success text-center">
                                            <span>Bienvenido,  <strong>@{user ? user.username : 'Usuario'}</strong> es tu feed, aquí verás publicaciones sobre mascotas extraviadas o avistamientos, recuerda que puedes reaccionar o comentar, estamos todos para ayudar.</span>
                                        </div>

                                        {/* Botón para mostrar u ocultar el formulario */}
                                        <div className="text-center">
    <button className={`btn ${showForm ? 'btn-dark' : 'btn-info'} p-2`} onClick={this.toggleForm}>
        {showForm ? (
            <i className="feather-x text-light m-2">Cerrar formulario</i>
        ) : (
            <i className="feather-plus text-light m-2">Crear publicación</i>
        )}
    </button>
</div>

                                        {/* Renderiza el formulario si showForm es true */}
                                        {showForm && <Createpost />}
                                    </div>
                                    <div className="border rounded bg-grey d-flex justify-content-around">
                                    <button className="btn btn-secondary p-auto"> Para ti </button>
                                    <button className="btn btn-secondary"> Siguiendo </button>


                                </div>
                                </div>
                                
                                <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                                    <Friends />
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

export default Home;
