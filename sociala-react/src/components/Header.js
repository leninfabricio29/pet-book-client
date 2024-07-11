import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';

function Header() {
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
                    for (let index = 0; index < notifications.length; index++) {
                        const element = notifications[index];
                        if (!element.view) {
                            unreadCount++;
                        }
                    }

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
        <div className="nav-header bg-white shadow-xs border-0">
            <div className="nav-top">
                <Link to="/">
                    <span className="fredoka-font mr-2 fw-600 text-current font-xxl logo-text m-4">PetBook</span>
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className={`nav-menu me-0 ms-2 ${isOpen ? "active" : ""}`}></button>
            </div>

            <div className='text-center d-flex justify-content-center align-items-center m-4'>
                <NavLink activeClassName="active" to="/home" className="p-2 text-center ms-3 menu-icon center-menu-icon">
                    <i className="feather-home font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i>
                </NavLink>
                {profile && (
                    <NavLink activeClassName="active" to="/defaultnoti" className="p-2 text-center ms-0 menu-icon center-menu-icon">
                        <div className="notification-icon-container">
                            <i className="feather-bell font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500"></i>
                            {countNotifications > 0 && (
                                <span className="notification-count">
                                    {countNotifications}
                                </span>
                            )}
                        </div>
                    </NavLink>
                )}

                <NavLink activeClassName="active" to="/defaultmember" className="p-2 text-center ms-0 menu-icon center-menu-icon">
                    <i className="feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i>
                </NavLink>
            </div>

            <Link to="/authorpage" className="p-0 ms-auto menu-icon d-flex justify-content-center">
                <h5 className='h5 mr-2'> Bienvenido, <span className="text-success"> {user ? `${user.name} ${user.last_name}` : 'Usuario'} </span> </h5>
            </Link>

            {profile && (
                <img src={profile.profile.photo_profile_url} alt="Profile" width={40} height={40} className=' m-2 rounded' />
            )}

            <nav className={`navigation scroll-bar ${isOpen ? "nav-active" : ""}`}>
                <div className="container ps-0 pe-0">
                    <div className="nav-content">
                        <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                            <div className="nav-caption fw-600 font-xssss text-grey-500"><span>Opciones de </span>esta red </div>
                            <ul className="mb-1 top-content">
                                <li className="logo d-none d-xl-block d-lg-block"></li>
                                <li><Link to="/home" className="nav-content-bttn open-font"><i className="feather-home btn-round-md text-grey-500 me-3"></i><span>Inicio</span></Link></li>
                                <li><Link to="/defaultforums" className="nav-content-bttn open-font"><i className="feather-edit btn-round-md text-grey-500 me-3"></i><span>Foros</span></Link></li>
                                <li><Link to="/defaultevents" className="nav-content-bttn open-font"><i className="feather-calendar btn-round-md text-grey-500 me-3"></i><span>Eventos</span></Link></li>
                                <li><Link to="/defaultanalytics" className="nav-content-bttn open-font"><i className="feather-pie-chart btn-round-md text-grey-500 me-3"></i><span>Estadísticas</span></Link></li>
                                <li><Link to="/defaultnoti" className="nav-content-bttn open-font"><i className="feather-bell btn-round-md text-grey-500 me-3"></i><span>Notificaciones</span></Link></li>
                            </ul>
                        </div>

                        <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1">
                            <div className="nav-caption fw-600 font-xssss text-grey-500"><span></span> Cuenta</div>
                            <ul className="mb-1">
                                <li className="logo d-none d-xl-block d-lg-block"></li>
                                <li><Link to="/defaultsettings" className="nav-content-bttn open-font h-auto pt-2 pb-2"><i className="font-sm feather-settings btn-round-md text-grey-500 me-3"></i><span>Configuraciones</span></Link></li>
                                <li><Link to="/login" className="nav-content-bttn open-font h-auto pt-2 pb-2"><i className="font-sm feather-lock btn-round-md text-grey-500 me-3"></i><span>Salir</span></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
