import React, { Component , Fragment } from "react";
import Header from '../components/Header';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';

import ProfilecardTwo from '../components/ProfilecardTwo';



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