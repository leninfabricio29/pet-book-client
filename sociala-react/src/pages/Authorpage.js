import React, { Component , Fragment } from "react";
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';

import Profiledetail from '../components/Profiledetail';
import Profilephoto from '../components/Profilephoto';
import ProfilecardTwo from '../components/ProfilecardTwo';
import Createpost from '../components/Createpost';
import Postview from '../components/Postview';
import Load from '../components/Load';


class Authorpage extends Component {
    render() {
        return (
            <Fragment> 
                <Header />

                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0">
                            <div className="row">
                                <div className="col-xl-12">
                                    <ProfilecardTwo />
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

export default Authorpage;