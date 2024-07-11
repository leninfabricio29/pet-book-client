import React, { Component } from 'react';
import ReactDOM from 'react-dom';


import './main.scss';
import { GoogleMapsProvider } from './utils/GoogleMapsContext';


import Home from './pages/Home';

import Member from './pages/Member';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Password from './pages/Password';
import Notification from './pages/Notification';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Notfound from './pages/Notfound';
import Pets from './pages/Pets';
import DetailPets from './pages/DetailPets';
import Welcome from './pages/Welcome';


import Event from './pages/Event';
import Videos from './pages/Videos';


import DetailPost    from './pages/DetailPost';
import Userpage from './pages/Userpage';
import Authorpage from './pages/Authorpage';
import Analytics from './pages/Analytics';
import Forums from './pages/Forums';


import { BrowserRouter, Switch, Route  } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import NewPet from './pages/NewPet';
import Eventos from './pages/Eventos';


class Root extends Component{
  render(){
      return(

        
        
          <BrowserRouter basename={'/'}>

            
              <Switch>


              <GoogleMapsProvider>
            
            

                    <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/home`} component={Home}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultsettings`} component={Settings}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultvideo`} component={Videos}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultanalytics`} component={Analytics}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultevent`} component={Eventos}/>

                    

                    <Route exact path={`${process.env.PUBLIC_URL}/accountinformation`} component={Account}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultpets`} component={Pets}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/detailpets/:id`} component={DetailPets}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/newpet`} component={NewPet}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultforums`} component={Forums}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/detailpost/:id`} component={DetailPost}/>


                    <Route exact path={`${process.env.PUBLIC_URL}/defaultmember`} component={Member}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/password`} component={Password}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultnoti`} component={Notification}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/register`} component={Register}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/forgot`} component={Forgot}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/notfound`} component={Notfound}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/welcome`} component={Welcome}/>


                          
                    
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultevents`} component={Event}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/userpage/:id`} component={Userpage}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/authorpage`} component={Authorpage}/>  

                
                    </GoogleMapsProvider> 
                    
              </Switch>
          </BrowserRouter>
      )
  }
}



ReactDOM.render(<Root/>, document.getElementById('root'));
serviceWorker.register();