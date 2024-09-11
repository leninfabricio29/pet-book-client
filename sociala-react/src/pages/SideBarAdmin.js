import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [countNotifications, setCountNotifications] = useState(0);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (storedUser) {
                setUser(storedUser);

                try {
                    const profileResponse = await axios.get(`http://localhost:3010/api/v1/profiles/${storedUser._id}`);
                    const data = profileResponse.data;

                    const owner = data.user._id;

                    setProfile(data);

                    const response = await axios.post('http://localhost:3010/api/v1/notifications/profile/notifications', { owner });
                    const notifications = response.data;

                    let unreadCount = 0;
                    notifications.forEach(notification => {
                        if (!notification.view) {
                            unreadCount++;
                        }
                    });

                    setCountNotifications(unreadCount);

                } catch (error) {
                    console.error('Error fetching profile data', error);
                }
            } else {
                // Redirigir a login si no hay usuario en localStorage
                history.push('/');
            }
        };

        fetchData();
    }, [history]);

    return (
        <div className="nav-header  shadow-xs border-0 ">
            <div className="nav-top ">
                <Link to="/">
                    <span className="fredoka-font mr-2 fw-600 text-current font-xxl logo-text m-4">PetBook</span>
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className={`nav-menu me-0 ms-2 ${isOpen ? "active" : ""}`}></button>
            </div>

            <div className='text-center d-flex justify-content-center align-items-center m-4 text-grey' >
                <strong>Módulo de administración</strong>
            </div>

            <Link to="/authorpage" className="p-0 ms-auto menu-icon d-flex justify-content-center ">
                <h5 className='h5 mr-2 text-dark'> Bienvenido, <span className="text-dark"> {user ? `${user.name} ${user.last_name}` : 'Usuario'} </span> </h5>
            </Link>

            

            <nav className={`navigation scroll-bar ${isOpen ? "nav-active" : ""}`}>
                <div className="container ps-0 pe-0 ">
                    <div className="nav-content">
                        <div className="nav-wrap bg-admin  rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                            <div className="nav-caption fw-600 font-xssss text-grey-500"><span>Operaciones </span>administraivas</div>
                            <ul className="mb-1 top-content text-grey">
                                <li className="logo d-none d-xl-block d-lg-block"></li>
                                <li><Link to="/home" className="nav-content-bttn open-font"><i className="feather-home btn-round-md text-grey-500 me-3"></i><span>Administración</span></Link></li>
                                <li><Link to="/admin/users" className="nav-content-bttn open-font"><i className="feather-users btn-round-md text-grey-500 me-3"></i><span>Usuarios</span></Link></li>
                                <li><Link to="/admin/pets" className="nav-content-bttn open-font"><i className="feather-github btn-round-md text-grey-500 me-3"></i><span>Mascotas</span></Link></li>
                                <li><Link to="/defaultnoti" className="nav-content-bttn open-font"><i className="feather-calendar btn-round-md text-grey-500 me-3"></i><span>Eventos</span></Link></li>
                                <li><Link to="/defaultnoti" className="nav-content-bttn open-font"><i className="feather-mic btn-round-md text-grey-500 me-3"></i><span>Foros</span></Link></li>

                            </ul>
                        </div>

                        
                    </div>

                    <div className="nav-content">
                    <div className="nav-wrap bg-admin  rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                    <div className="nav-caption fw-600 font-xssss text-grey-500"><span>Operaciones </span> extras</div>
                            <ul className="mb-1 top-content">
                                <li className="logo d-none d-xl-block d-lg-block"></li>
                                <li><Link to="/defaultnoti" className="nav-content-bttn open-font"><i className="feather-help-circle btn-round-md text-grey-500 me-3"></i><span>Ayuda</span></Link></li>

                                <li><Link to="/defaultnoti" className="nav-content-bttn open-font"><i className="feather-log-out btn-round-md text-grey-500 me-3"></i><span>Salir</span></Link></li>

                            </ul>
                        </div>

                        <div>
                        </div>

                    </div>
                </div>
            </nav>
        </div>
    );
};

export default SideBar;
