import React, { Component, forwardRef } from 'react';
import Profilephoto from './Profilephoto';
import axios from 'axios';
import './user-post.css'
import { Link } from 'react-router-dom';

class ProfilecardTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'sobreMi',
            user: null,
            profile: null,
            events: [],
            followers: [],
            following: [],
            posts: [],
            isLoading: true,
            error: null,
        };
    }

    async componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.setState({ user });

            try {
                const profileResponse = await axios.get(`http://localhost:3010/api/v1/profiles/${user._id}`);
                const profileId = profileResponse.data.profile._id;
                
                // Then, fetch the remaining data in parallel using Promise.all
                const [followersResponse, followingResponse, eventsResponse, postsResponse] = await Promise.all([
                    axios.get(`http://localhost:3010/api/v1/profiles/followers/${profileId}`),
                    axios.get(`http://localhost:3010/api/v1/profiles/following/${profileId}`),
                    axios.get(`http://localhost:3010/api/v1/events/${user._id}`),
                    axios.get(`http://localhost:3010/api/v1/posts/user/${user._id}`)
                ]);

                this.setState({
                    profile: profileResponse.data,
                    followers: followersResponse.data,
                    following: followingResponse.data,
                    events: eventsResponse.data,
                    posts: postsResponse.data,
                    isLoading: false,
                });
            } catch (error) {
                this.setState({
                    error: error.message,
                    isLoading: false,
                });
            }
        } else {
            this.setState({
                error: 'No user ID found in local storage',
                isLoading: false,
            });
        }
    }

    handleTabClick = (tabName) => {
        this.setState({ activeTab: tabName });
    };

    getParticipantIds = (eventId) => {
        axios.get(`http://localhost:3010/api/v1/events/users-events/${eventId}`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const monthName = months[monthIndex];
        return `${day} ${monthName} ${year}`;
    };

    render() {
        const { activeTab, user, profile, events, followers, following, isLoading, error, posts } = this.state;

        

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        if (!user) {
            return <div>No user data available</div>;
        }

        return (
            <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3 overflow-hidden">
                <div className="card-body position-relative h240 bg-image-cover bg-image-center"
                    style={{ backgroundImage: `url(${profile.profile.photo_cover_url})` }}>
                </div>
                <div className="card-body d-block pt-4 text-center position-relative">
                    <figure className="avatar mt--6 position-relative w75 z-index-1 w100 z-index-1 ms-auto me-auto">
                        <img src={profile.profile.photo_profile_url} alt="avatar" className="p-1 bg-white rounded-xl w-100" />
                    </figure>
                    <h4 className="font-xs ls-1 fw-700 text-grey-900">{user.name} {user.last_name}
                        <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">@{user.username}</span>
                    </h4>

                    <div className="d-flex align-items-center justify-content-center position-absolute right-15 top-10 mt-2 me-2">
                        <a href="/defaultmember" className="d-none d-lg-block bg-instagram p-3 z-index-1 rounded-3 text-white font-xsssss text-uppercase fw-700 ls-3">Borrar Perfil</a>
                    </div>
                </div>
                <div className="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
                    <ul className="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4" id="pills-tab" role="tablist">
                        <li className={`list-inline-item me-5 ${activeTab === 'sobreMi' ? 'active' : ''}`}>
                            <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#sobremi" onClick={() => this.handleTabClick('sobreMi')}>Sobre mi</a>
                        </li>
                        <li className={`list-inline-item me-5 ${activeTab === 'seguidores' ? 'active' : ''}`}>
                            <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#seguidores" onClick={() => this.handleTabClick('seguidores')}>Seguidores</a>
                        </li>
                        <li className={`list-inline-item me-5 ${activeTab === 'siguiendo' ? 'active' : ''}`}>
                            <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#siguiendo" onClick={() => this.handleTabClick('siguiendo')}>Siguiendo</a>
                        </li>
                        <li className={`list-inline-item me-5 ${activeTab === 'publicaciones' ? 'active' : ''}`}>
                            <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#publicaciones" onClick={() => this.handleTabClick('publicaciones')}>Publicaciones</a>
                        </li>
                        <li className={`list-inline-item me-5 ${activeTab === 'eventos' ? 'active' : ''}`}>
                            <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#eventos" onClick={() => this.handleTabClick('eventos')}>Eventos</a>
                        </li>
                    </ul>
                </div>
                <div className="tab-content">
                    <div className={`tab-pane fade show ${activeTab === 'sobreMi' ? 'active' : ''}`} id="sobremi">
                        <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                            <div className="card-body d-block p-4">
                                <h4 className="fw-700 mb-3 font-xsss text-grey-900">Sobre mi</h4>
                            </div>
                            <hr className="hr" />
                            <div className="card-body d-flex pt-0">
                                <i className="feather-phone text-grey-500 me-3 font-lg"></i>
                                <h4 className="fw-700 text-grey-900 font-xssss mt-0">
                                    Número de contacto <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">0{profile.profile.number_phone}</span>
                                </h4>
                            </div>

                            <hr className="hr" />
                            <div className="card-body d-flex pt-0">
                                <i className="feather-edit text-grey-500 me-3 font-lg"></i>
                                <h4 className="fw-700 text-grey-900 font-xssss mt-0">
                                    Palabra descriptiva <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{profile.profile.word_description}</span>
                                </h4>
                            </div>

                            <hr className="hr" />
                            <div className="card-body d-flex pt-0">
                                <i className="feather-mail text-grey-500 me-3 font-lg"></i>
                                <h4 className="fw-700 text-grey-900 font-xssss mt-0">
                                    Descripción <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{profile.profile.description}</span>
                                </h4>
                            </div>

                            
                        </div>
                    </div>
                    <div className={`tab-pane fade show ${activeTab === 'seguidores' ? 'active' : ''}`} id="seguidores">
                        <div className="card-body d-flex flex-wrap p-2">
                            {followers.map((follower, index) => (
                                 <div key={index} className="col-md-3 col-sm-4 pe-2 ps-2">
                                 <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                                     <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                                         <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                                             <img src={follower.photo_profile_url} alt="avatar" className="float-right p-0 bg-white rounded-circle w-100 shadow-xss" />
                                         </figure>
                                         <div className="clearfix w-100"></div>
                                         <Link to={`/userpage/${follower.user._id}`}>
                                             <h4 className="fw-700 text-grey-900 font-xssss mt-4">
                                                 {follower.user.name} {follower.user.last_name}
                                             </h4>
                                         </Link>
                                         <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">@{follower.user.username}</p>

                                         <div>
                                                                                        </div>
                                     </div>
                                 </div>
                             </div>
                            ))}
                        </div>
                    </div>
                    <div className={`tab-pane fade show ${activeTab === 'siguiendo' ? 'active' : ''}`} id="siguiendo">
                        <div className="card-body d-flex flex-wrap p-2">
                            {following.map((follow, index) => (
                                  <div key={index} className="col-md-3 col-sm-4 pe-2 ps-2">
                                  <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                                      <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                                          <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                                              <img src={follow.photo_profile_url} alt="avatar" className="float-right p-0 bg-white rounded-circle w-100 shadow-xss" />
                                          </figure>
                                          <div className="clearfix w-100"></div>
                                          <Link to={`/userpage/${follow.user_id}`}>
                                              <h4 className="fw-700 text-grey-900 font-xssss mt-4">
                                                  {follow.user.name} {follow.user.last_name}
                                              </h4>
                                          </Link>
                                          <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">@{follow.user.username}</p>

                                          <div>
                                          <a 
                      className="p-2 lh-20 w100 bg-instagram me-2 text-white text-center font-xssss fw-600 ls-1 pointer 
                       rounded-xl">Dejar de seguir</a>                                                        </div>
                                      </div>
                                  </div>
                              </div>
                            ))}
                        </div>
                    </div>
                    <div className={`tab-pane fade show ${activeTab === 'publicaciones' ? 'active' : ''}`} id="publicaciones">
                    <div className="container">
  <div className="row">
    {posts.map((post) => {
      const imageUrl = 
        post.type === 'Avistamiento' ? post.photo_post_url : 
        post.type === 'Perdida' || post.type === 'Adopcion' ? post.petPhoto : '';

      return (
        <div className="col-md-3 mb-4 " key={post.id}>
            <div className='text-center'>
            <spam className="text-dark text-center">{post.type}</spam>

                </div>
          <div className="card-container ">
            <img src={imageUrl} alt="Post Image" className="card-image img-fluid" />
            <div className="card-overlay">
              <div className="overlay-text">
                <span>❤️ {post.amount_reactions}</span>
                <span>💬 {post.amount_comments}</span>
              </div>
            </div>
          </div>
          <div className='text-center'>
          <a 
                      className="p-2 lh-20 w100 bg-instagram me-2 text-white text-center font-xssss fw-600 ls-1 pointer 
                       rounded-xl">Eliminar</a> 

            </div>
        </div>
      );
    })}
  </div>
</div>

                    </div>
                    <div className={`tab-pane fade show ${activeTab === 'eventos' ? 'active' : ''}`} id="eventos">
                        <div className="card-body d-flex flex-wrap p-2">
                            {events.map((event, index) => (
                                 <div key={index} className="d-inline-block mt-4">
                                 <div className=" rounded p-2 shadow m-2">
                                   <div className="row align-items-center">
                                     <div className="col-auto">
                                       <img
                                         src="https://cdn4.iconfinder.com/data/icons/marketing-and-digital-marketing/32/business_marketing_advertising_event_calendar-21-512.png"
                                         alt="Imagen de calendario"
                                         style={{ width: 40 }}
                                       />
                                     </div>
                                     <div className="col">
                                       <span className="d-block font-weight-bold">
                                       <i className='feather-mail me-2'></i>
                             
                                       <strong className='fw-700 font-xssss text-grey-500'> Jornada de {event.description} </strong>  
                                       </span>
                                       <span className="d-block">
                                       <i className='feather-map-pin me-2'></i>
                             
                                       <strong className='fw-700 font-xssss text-grey-500'> Fecha: {new Date(event.date).toLocaleDateString('es-ES')} </strong> 
                                       </span>
                                       
                                     </div>
                                   </div>
                             
                                   <div className='row mx-auto'>
                                   <button className="btn btn-info fw-500 font-xsss text-light mx-2 mt-2" onClick={() => this.getParticipantIds(event._id)}>
                                                                                 Ver participantes
                                                                             </button>
                                     </div>
                                 </div>
                                 </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfilecardTwo;
