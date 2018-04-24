import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentUser, getSetting, Components, registerComponent, replaceComponent } from 'meteor/vulcan:core';
import { IndexLink } from 'react-router';

const CustomHeader = (props, context) => {

  const logoUrl = getSetting("logoUrl");
  const siteTitle = getSetting("title", "My App");
  const tagline = getSetting("tagline");

  return (
    <div className="header-wrapper">

      <header id="headerBig" className="header">


        <Components.Logo logoUrl={logoUrl} siteTitle={siteTitle} />
       
        <Components.SearchForm/>
        {!!props.currentUser ? 
        <div className="nav">
        
           
          
          <div className="nav-user">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
          </div>
          

        </div>
        : 
        <div className="nav navVisitor">

          <div className="nav-user">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
          </div>
          

        </div>
        }
      </header>
      <header id="headerSmall" className="header">
        <div className="headerInner">
        
        
        <Components.Logo logoUrl={logoUrl} siteTitle={siteTitle} />
        
        {!!props.currentUser ? 
        <div className="nav navUser">

          <input type="checkbox" className="openSearchDrop" id="openSearchDrop"/>
          <label htmlFor="openSearchDrop" className="searchIconToggle"><img src="/packages/moonly/lib/static/search.png" alt="search moonly"/></label>
          <div className="searchDropdown">
           <Components.SearchForm/>
          </div>
         
          <div className="nav-user">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
          </div>
          
        </div>
        : 
        <div className="nav navVisitor">
          

          <input type="checkbox" className="openSearchDrop" id="openSearchDrop"/>
          <label htmlFor="openSearchDrop" className="searchIconToggle"><img src="/packages/moonly/lib/static/search.png" alt="search moonly"/></label>
          <div className="searchDropdown">
           <Components.SearchForm/>
          </div>
          <div className="nav-user">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
          </div>
          

        </div>
        }
        </div>
        
       
        
      </header>
    </div>
  )
}

CustomHeader.displayName = "Header";

CustomHeader.propTypes = {
  currentUser: PropTypes.object,
};

replaceComponent('Header', CustomHeader, withCurrentUser);
