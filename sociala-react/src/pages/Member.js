import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Pagetitle from '../components/Pagetitle';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import axios from "axios";
import { Link } from 'react-router-dom';

class Member extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    }

    async componentDidMount() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const profileResponse = await axios.get(`http://localhost:3010/api/v1/profiles/${user._id}`);
            const { data } = profileResponse;
            const profileId = data.profile._id;

            const response = await axios.get('http://localhost:3010/api/v1/users/list');
            const usersData = response.data;
            this.setState({ users: usersData, profileId });

            

        } catch (error) {
            console.error("There are errors: ", error);
        }
    }

    

    render() {
        const { users } = this.state;

        return (
            <Fragment>
                <Header />
                <Leftnav />
                <Rightchat />
                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0">
                            <div className="row">
                                <div className="col-xl-12">
                                    <Pagetitle title="Todos los usuarios de PetBook" />
                                    <div className="row ps-2 pe-2">
                                        {users.length > 0 ? users.map((user, index) => (
                                            <div key={index} className="col-md-3 col-sm-4 pe-2 ps-2">
                                                <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                                                    <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                                                        <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                                                            <img src={user.photo_profile_url} alt="avatar" className="float-right p-0 bg-white rounded-circle w-100 shadow-xss" />
                                                        </figure>
                                                        <div className="clearfix w-100"></div>
                                                        <Link to={`/userpage/${user.user._id}`}>
                                                            <h4 className="fw-700 text-grey-900 font-xssss mt-4">
                                                                {user.user.name} {user.user.last_name}
                                                            </h4>
                                                        </Link>
                                                        <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">@{user.user.username}</p>

                                                        <div>
                                                        <a 
                                    className="p-2 lh-20 w100 bg-success me-2 text-white text-center font-xssss fw-600 ls-1 pointer 
                                     rounded-xl">Seguir</a>                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : <p>Loading...</p>}
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

export default Member;
