import React, { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';

function Header() {
    
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isNoti, setIsNoti] = useState(false);
    const [user, setUser] = useState(null);
    const history = useHistory();

    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            // Redirigir a login si no hay usuario en localStorage
            history.push('/');
        }
    }, [history]);

    const toggleOpen = () => setIsOpen(!isOpen);
    const toggleActive = () => setIsActive(!isActive);

    const navClass = `${isOpen ? " nav-active" : ""}`;
    const buttonClass = `${isOpen ? " active" : ""}`;

    return (
        <div className="nav-header bg-white shadow-xs border-0">
        <div className="nav-top">
            <Link to="/"><span className="fredoka-font mr-2 fw-600 text-current font-xxl logo-text m-4 ">PetBook </span> </Link>
            <Link to="/defaultmessage" className="mob-menu ms-auto me-2 chat-active-btn"><i className="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i></Link>
            <Link to="/defaultvideo" className="mob-menu me-2"><i className="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i></Link>
            <span onClick={toggleActive} className="me-2 menu-search-icon mob-menu"><i className="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></span>
            <button onClick={toggleOpen} className={`nav-menu me-0 ms-2 ${buttonClass}`}></button>
        </div>

        <div className='m-4'>

        </div>

        <div className='m-4'>

        </div>
        <div className='m-4'>

        </div>

        <div className='m-4'>

        </div>

        
        <div className='text-center d-flex justify-content-center align-items-center  m-4'>
        <NavLink activeClassName="active" to="/home" className="p-2 text-center ms-3 menu-icon center-menu-icon"><i className="feather-home font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
        <NavLink activeClassName="active" to="/defaultstorie" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-globe font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
        <NavLink activeClassName="active" to="/defaultgroup" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>

        </div>

       
            
        
        <Link to="/authorpage" className="p-0 ms-auto menu-icon d-flex justify-content-center">
        <h5 className='h5 mr-2'> Bienvenido,<spam className="text-success"> {user ? `${user.name} ${user.last_name}` : 'Usuario'}</spam>  </h5>


                      </Link>

                      <i className="feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 m-2 "></i>  
            




        <nav className={`navigation scroll-bar ${navClass}`}>
            <div className="container ps-0 pe-0">
                <div className="nav-content">
                    <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                        <div className="nav-caption fw-600 font-xssss text-grey-500"><span>Opciones de </span>esta red </div>
                        <ul className="mb-1 top-content">
                            <li className="logo d-none d-xl-block d-lg-block"></li>
                            <li><Link to="/home" className="nav-content-bttn open-font"><i className="feather-home btn-round-md text-grey-500 me-3"></i><span>Inicio</span></Link></li>
                            <li><Link to="/defaultforums" className="nav-content-bttn open-font"><i className="feather-edit btn-round-md text-grey-500 me-3"></i><span>Foros</span></Link></li>
                            <li><Link to="/defaultbadge" className="nav-content-bttn open-font"><i className="feather-search btn-round-md text-grey-500 me-3"></i><span>Buscar</span></Link></li>
                            <li><Link to="/defaultstorie" className="nav-content-bttn open-font"><i className="feather-globe btn-round-md text-grey-500 me-3"></i><span>Historias</span></Link></li>
                            <li><Link to="/defaultevents" className="nav-content-bttn open-font"><i className="feather-calendar btn-round-md text-grey-500 me-3"></i><span>Eventos</span></Link></li>
                            <li><Link to="/defaultanalytics" className="nav-content-bttn open-font"><i className="feather-pie-chart btn-round-md text-grey-500 me-3"></i><span>Estadísticas</span></Link></li>  
                            <li><Link to="/defaultgroup" className="nav-content-bttn open-font"><i className="feather-bell btn-round-md text-grey-500 me-3"></i><span>Notificaciones</span></Link></li>



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



