import React, { Component, Fragment } from "react";
import axios from 'axios';
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import { Tooltip } from "@mui/material";

class Notification extends Component {
    state = {
        notifications: [],
        loading: true,
        user: null,
        error: null,
        emiterProfile: []
    };

    async componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.setState({ user });
            try {
                const profileResponse = await axios.get(`http://localhost:5000/api/v1/profiles/${user._id}`);
                const { data } = profileResponse;
                const owner = data.user._id;
    
                try {
                    const response = await axios.post('http://localhost:5020/api/v1/notifications/profile/notifications', { owner });
                    const notifications = response.data; // Obtener las notificaciones del response
    
                    // Preparar un array para almacenar las notificaciones con perfil asociado
                    const notificationsWithProfiles = [];
    
                    // Iterar sobre las notificaciones
                    for (let notification of notifications) {
                        try {
                            const emitterId = notification.emiter_id; // Obtener el emiter_id de la notificación
                            const profileResponse = await axios.get(`http://localhost:5000/api/v1/profiles/${emitterId}`);
                            const emitterProfile = profileResponse.data;
    
                            if (emitterProfile) {
                                // Agregar el perfil al objeto de notificación
                                const notificationWithProfile = {
                                    ...notification, // Conservar todas las propiedades originales de la notificación
                                    profile: emitterProfile // Agregar el perfil obtenido
                                };
    
                                notificationsWithProfiles.push(notificationWithProfile);
                            } else {
                                console.error(`Perfil no encontrado para el emiter_id: ${emitterId}`);
                            }
                        } catch (error) {
                            console.error(`Error al obtener perfil para notificación: ${notification._id}`, error);
                        }
                    }
    
                    // Actualizar el estado con las notificaciones completas
                    this.setState({ notifications: notificationsWithProfiles, loading: false });
                } catch (error) {
                    this.setState({ error: error.message, loading: false });
                }
    
            } catch (error) {
                console.error('Error fetching profile data:', error);
                this.setState({ error: 'Error fetching profile data', loading: false });
            }
        }
    }

    render() {
        const { notifications,  loading, error } = this.state;

        return (
            <Fragment>
                <Header />
                <Leftnav />
                <Rightchat />

                <div className="main-content theme-dark-bg right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="chat-wrapper p-3 w-100 position-relative scroll-bar bg-white theme-dark-bg">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
  <div className="text-start">
    <h2 className="fw-700 mb-4 mt-2 font-md text-grey-900 d-flex align-items-center">
      Notificaciones
      <span className="circle-count bg-warning text-white font-xsssss rounded-3 ms-2 ls-3 fw-600 p-2 mt-0">
        {notifications && notifications.length}
      </span>
    </h2>
  </div>

  <div className="text-end ">
    <button className="btn shadow me-2"> <strong className="text-grey-500 font-xsss ">Leídas</strong> </button>
    <button className="btn shadow me-2"> <strong className="text-grey-500 font-xsss ">No leídas</strong> </button>
    <button className="btn shadow me-2"> <strong className="text-grey-500 font-xsss ">Todas</strong> </button>
  </div>
</div>

                                        

                                        {loading && <p>Loading notifications...</p>}
                                        {error && <p>Error: {error}</p>}
                                        <ul className="notification-box ">
                                            {notifications && notifications.map((notification, index) => (
                                                <li key={index} className=" shadow rounded p-2 m-2">
                                                    <a href="/defaultnotification" className={`d-flex align-items-center p-3 rounded-3 ${notification.read ? 'bg-lightblue theme-light-bg' : ''}`}>
                                                        <img src={`${notification.profile.profile.photo_profile_url}`} alt="user" className="w45 me-3 rounded "></img>
                                                        {notification.type === 'like' && <i className="feather-heart text-danger mt-2"></i>}
                                                        {notification.type === 'comment' && <i className="feather-message-circle text-info mt-2"></i>}
                                                        {notification.type === 'foro' && <i className="feather-edit-3 text-warning mt-2"></i>}
                                                        <h6 className="font-xssss text-grey-900 mb-0 mt-0 fw-500 lh-20">
                                                            <strong>{notification.profile.user.name} {notification.profile.user.last_name}</strong> 
                                                            {notification.type === 'like' && ' Ha reaccionado a tu publicación'}
                                                            {notification.type === 'comment' && ' Ha comentado tu publicación'}
                                                            {notification.type === 'foro' && ' Ha publicado un nuevo foro'}
                                                            <span className="d-block text-grey-500 font-xssss fw-600 mb-0 mt-0">{new Date(notification.createdAt).toLocaleString()}</span>
                                                        </h6>

                                                        <div className="col-4 ms-auto ">
                                                            <div className="row">
                                                                <Tooltip title="Ver detalles">
                                                                <a className="text-grey-500 font-xsss " href="/detailsNotification"><i className="feather-eye p-2 rounded shadow bg-grey"></i> </a>

                                                                </Tooltip>
                                                            </div>

                                                            <div className="row mt-2">
                                                                <Tooltip title="Marcar como leída">
                                                                <a className="text-grey-500 font-xsss " href="/detailRead"> <i className="feather-check p-2 rounded shadow bg-info"></i> </a>

                                                                </Tooltip>

                                                            </div>

                                                        </div>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
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

export default Notification;
