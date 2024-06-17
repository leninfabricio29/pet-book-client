import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import axios from "axios";

class Userpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userProfile: null,
          isFollowing: false,
        };
    }

    componentDidMount() {
        this.fechteUserProfileDetails();
    }

    fechteUserProfileDetails = async () => {
        const {id} = this.props.match.params;

        try {
            const response = await axios.get(`http://localhost:5000/api/v1/profiles/${id}`)
            this.setState({ userProfile: response.data });
            const userProfileOb = this.state.userProfile


            console.log(userProfileOb);
            
        } catch (error) {
            console.error("Error fetching user profile:", error);

        }


    }

   
    render() {
        const { userProfile, isFollowing } = this.state;


        return (
            <Fragment> 
                <Header />
                <Leftnav />
                <Rightchat />

                {userProfile && (

                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0">
                            <div className="row">
                            <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
                <div className="card-body h250 p-0 rounded-xxl overflow-hidden m-3"><img src={userProfile.profile.photo_cover_url} alt="avater" /></div>
                <div className="card-body p-0 position-relative">
                    <figure className="avatar position-absolute w100 z-index-1" style={{top:'-40px',left:'30px'}}><img src={userProfile.profile.photo_profile_url} alt="avater" className="float-right p-1 bg-white rounded-circle w-100" /></figure>
            <div>
                                    <h4 className="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15">{userProfile.user.name} {userProfile.user.last_name}<span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">@{userProfile.user.username}</span></h4>

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
                        <li className="active list-inline-item me-5"><a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active" href="#navtabs1" data-toggle="tab">Sobre mi</a></li>
                        <li className="list-inline-item me-5"><a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs2" data-toggle="tab">Seguidores</a></li>
                        <li className="list-inline-item me-5"><a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs3" data-toggle="tab">Siguiendo</a></li>
                        <li className="list-inline-item me-5"><a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs4" data-toggle="tab">Publicaciones</a></li>
                        <li className="list-inline-item me-5"><a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs3" data-toggle="tab">Mascotas</a></li>
                        <li className="list-inline-item me-5"><a className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs1" data-toggle="tab">Eventos</a></li>
                    </ul>
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
