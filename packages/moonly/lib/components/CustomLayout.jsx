import { Components, registerComponent, withCurrentUser, replaceComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';


const CustomLayout = ({currentUser, children, currentRoute}) =>

  <div className={classNames('wrapper', `wrapper-${currentRoute.name.replace('.', '-')}`)} id="wrapper">

    <Helmet>
      <link name="bootstrap" rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"/>
      <link name="font-awesome" rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

    </Helmet>

    {currentUser ? <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} /> : null}

    <Components.Header />
    

    <div className="sidekick">
   
    
    <input type="checkbox" className="openSidebarCats" id="openSidebarCats"/>
    <label htmlFor="openSidebarCats" className="sidebarIconToggle"><Components.Icon name="bars"/></label>
    <Components.Sidebar />
    <Scrollbars>
    <div className="main" id="postPage">
   
    
      <div className="mainWrapperInner">
      <Components.FlashMessages />
      


      {/*<Components.Newsletter />*/}

      {children}
      </div>
      
    </div>
    </Scrollbars>
    </div>
    <Components.Footer />

  </div>

replaceComponent('Layout', CustomLayout, withCurrentUser);
