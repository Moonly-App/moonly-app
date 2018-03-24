import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentUser, getSetting, registerSetting, Components, registerComponent } from 'meteor/vulcan:core';
import { Scrollbars } from 'react-custom-scrollbars';

const Sidebar = (props, context) => {
  return (
   
    <div className="sidebar-wrapper">
     <Scrollbars>
        <div className="posts-list-header-categories">
          <Components.CategoriesList />
        </div>
        </Scrollbars>
    </div>
    
  )
}

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  currentUser: PropTypes.object,
};

registerComponent('Sidebar', Sidebar, withCurrentUser);
