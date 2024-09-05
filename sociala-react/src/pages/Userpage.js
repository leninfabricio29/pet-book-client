import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import axios from "axios";
import { Link } from 'react-router-dom';


class Userpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
            isFollowing: false,
            activeTab: 'sobreMi',
            user: null,
            events: [],
            followers: [],
            following: [],
            posts: [],
            pets: [],
            isLoading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchUserProfileDetails();
    }

    fetchUserProfileDetails = async () => {
        const { id } = this.props.match.params;
        const user = JSON.parse(localStorage.getItem('user'));
            this.setState({ user });
        

        try {
            const response = await axios.get(`http://localhost:3010/api/v1/profiles/${id}`);
            const profileData = response.data;

            const profileResponse = await axios.get(`http://localhost:3010/api/v1/profiles/${user._id}`);
            const followersUserCurrent = profileResponse.data.profile.following;

           

            if (followersUserCurrent.includes(profileData.profile._id)) {
                this.setState({ isFollowing: true });

            }else{
                this.setState({ isFollowing: false });

            }



            const followersResponse = await axios.get(`http://localhost:3010/api/v1/profiles/followers/${profileData.profile._id}`);
            const followingResponse = await axios.get(`http://localhost:3010/api/v1/profiles/following/${profileData.profile._id}`);
            const postsResponse = await axios.get(`http://localhost:3010/api/v1/posts/user/${profileData.user._id}`)
            const petsResponse = await axios.post('http://localhost:3010/api/v1/pets/search', {
                owner: profileData.user._id,
            });


            console.log(petsResponse);

            const eventsResponse = await axios.get(`http://localhost:3010/api/v1/events/${profileData.user._id}`);

            

            this.setState({
                userProfile: profileData,
                followers: followersResponse.data,
                following: followingResponse.data,
                posts: postsResponse.data,
                pets: petsResponse.data,
                events: eventsResponse.data,
                isLoading: false,
            });
        } catch (error) {
            console.error("Error fetching user profile:", error);
            this.setState({ error, isLoading: false });
        }
    }

    handleFollowToggle = () => {
        this.setState(prevState => ({ isFollowing: !prevState.isFollowing }));
    }

    renderTabContent = () => {
        const { activeTab, userProfile, followers, following, posts , pets, isFollowing} = this.state;

        switch (activeTab) {
            case 'sobreMi':
                return (
                    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                            <div className="card-body d-block p-4">
                                <h4 className="fw-700 mb-3 font-xsss text-grey-900">Sobre mi</h4>
                            </div>
                            <hr className="hr" />
                            <div className="card-body d-flex pt-0">
                                <i className="feather-phone text-grey-500 me-3 font-lg"></i>
                                <h4 className="fw-700 text-grey-900 font-xssss mt-0">
                                    Número de contacto <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">0{userProfile.profile.number_phone}</span>
                                </h4>
                            </div>

                            <hr className="hr" />
                            <div className="card-body d-flex pt-0">
                                <i className="feather-edit text-grey-500 me-3 font-lg"></i>
                                <h4 className="fw-700 text-grey-900 font-xssss mt-0">
                                    Palabra descriptiva <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{userProfile.profile.word_description}</span>
                                </h4>
                            </div>

                            <hr className="hr" />
                            <div className="card-body d-flex pt-0">
                                <i className="feather-mail text-grey-500 me-3 font-lg"></i>
                                <h4 className="fw-700 text-grey-900 font-xssss mt-0">
                                    Descripción <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{userProfile.profile.description}</span>
                                </h4>
                            </div>

                            
                        </div>
                );
            case 'seguidores':
                return (
                    <div>
                        <div className="card-body d-block p-4">
                                <h4 className="fw-700 mb-3 font-xsss text-grey-900">Seguidores</h4>
                            </div>
                            <hr className="hr" />
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
                );
            case 'siguiendo':
                return (
                    <div>
                        <div className="card-body d-block p-4">
                                <h4 className="fw-700 mb-3 font-xsss text-grey-900">Seguidores</h4>
                            </div>
                            <hr className="hr" />
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

                              </div>
                          </div>
                      </div>
                    ))}
                </div>
                    </div>
                    
                );
            case 'publicaciones':
                return (
                    <div>
    {isFollowing ? (
        <div> 
            <div className="card-body d-block p-4">
                                <h4 className="fw-700 mb-3 font-xsss text-grey-900">Publicaciones</h4>
                            </div>
                            <hr className="hr" />
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
               
              </div>
            );
          })}
        </div>
        </div>
        </div>
       
    ) : (
        <div className=" text-center">
                            <p className="alert alert-warning m-4">Para ver las publicaciones de este usuario, primero debes seguirlo</p>
                            
                        </div>
    )}
</div>
               );
            case 'mascotas':
                return (
                    <div>
                        <div className="card-body d-block p-4">
                                <h4 className="fw-700 mb-3 font-xsss text-grey-900">Mascotas</h4>
                            </div>
                            <hr className="hr" />
                    {isFollowing ? (
                         <div className="card-body d-flex flex-wrap p-2">
                         {pets.map((pet, index) => (
                               <div key={index} className="col-md-3 col-sm-4 pe-2 ps-2">
                               <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                                   <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                                       <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                                           <img src={pet.photo_url} alt="avatar" className="float-right p-0 bg-white rounded-circle w-100 shadow-xss" />
                                       </figure>
                                       <div className="clearfix w-100"></div>
                                      
                                           <h4 className="fw-700 text-grey-900 font-xssss mt-4">
                                              Mi nombre es:  {pet.name}
                                           </h4>
                                       <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3"> Soy de raza: {pet.breed}</p>
     
                                   </div>
                               </div>
                           </div>
                         ))}
                     </div>
                    ) : (
                        <div className=" text-center">
                            <p className="alert alert-warning m-4">Para ver las mascotas de este usuario, primero debes seguirlo</p>
                            
                        </div>
                    )}
                </div>
                );
            default:
                return null;
        }
    }

    render() {
        const { userProfile, isFollowing, isLoading, error } = this.state;

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <Fragment>
                <Header />
                <Rightchat />
                {userProfile && (
                    <div className="main-content right-chat-active">
                        <div className="middle-sidebar-bottom">
                            <div className="middle-sidebar-left pe-0">
                                <div className="row">
                                    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
                                        <div className="card-body h250 p-0 rounded-xxl overflow-hidden m-3">
                                            <img src={userProfile.profile.photo_cover_url} alt="cover" />
                                        </div>
                                        <div className="card-body p-0 position-relative">
                                            <figure className="avatar position-absolute w100 z-index-1" style={{ top: '-40px', left: '30px' }}>
                                                <img src={userProfile.profile.photo_profile_url} alt="profile" className="float-right p-1 bg-white rounded-circle w-100" />
                                            </figure>
                                            <div>
                                                <h4 className="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15">
                                                    {userProfile.user.name} {userProfile.user.last_name}
                                                    <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">@{userProfile.user.username}</span>
                                                </h4>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
                                                <button
                                                    onClick={this.handleFollowToggle}
                                                    className={`d-none d-lg-block p-3 z-index-1 rounded-3 text-white font-xsssss text-uppercase fw-700 ls-3 ${isFollowing ? 'bg-danger' : 'bg-success'}`}
                                                >
                                                    {isFollowing ? 'Dejar de Seguir' : 'Seguir Usuario'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
                                            <ul className="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4" id="pills-tab" role="tablist">
                                                <li className="active list-inline-item me-5">
                                                    <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" onClick={() => this.setState({ activeTab: 'sobreMi' })} role="tab">Sobre mi</a>
                                                </li>
                                                <li className="list-inline-item me-5">
                                                    <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" onClick={() => this.setState({ activeTab: 'seguidores' })} role="tab">Seguidores</a>
                                                </li>
                                                <li className="list-inline-item me-5">
                                                    <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" onClick={() => this.setState({ activeTab: 'siguiendo' })} role="tab">Siguiendo</a>
                                                </li>
                                                <li className="list-inline-item me-5">
                                                    <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" onClick={() => this.setState({ activeTab: 'publicaciones' })} role="tab">Publicaciones</a>
                                                </li>
                                                <li className="list-inline-item me-5">
                                                    <a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" onClick={() => this.setState({ activeTab: 'mascotas' })} role="tab">Mascotas</a>
                                                </li>
                                               
                                            </ul>
                                            <div className="tab-content">
                                                {this.renderTabContent()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Popupchat />
                <Appfooter />
            </Fragment>
        );
    }
}

export default Userpage;
