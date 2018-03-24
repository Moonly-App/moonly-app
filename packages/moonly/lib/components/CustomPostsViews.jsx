import { registerComponent, withCurrentUser, Utils, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router'
import Users from 'meteor/vulcan:users';

const CustomPostsViews = (props, context) => {

  let views = [ 'top', 'best', 'new'];
  let adminViews = ['pending', 'rejected', 'scheduled'];


  const query = _.clone(props.router.location.query);

  return (
    <div className="posts-views">
        <div className="postsViewVisitor">
        {views.map(view =>
          <LinkContainer id={"post-view-"+view} key={view} to={{pathname: Utils.getRoutePath('posts.list'), query: {...query, view: view}}} className={"dropdown-item "+view}>
            <MenuItem>
              <span className="viewIcon"></span>
              <FormattedMessage id={"posts."+view}/>
            </MenuItem>
          </LinkContainer>
        )}
        
        <LinkContainer id="post-view-daily" to="/daily" className="dropdown-item daily">
          <MenuItem className="bar">
            <FormattedMessage id="posts.daily"/>
          </MenuItem>
        </LinkContainer>
        </div>
    </div>
  )
}

CustomPostsViews.propTypes = {
  currentUser: PropTypes.object,
  defaultView: PropTypes.string
};

CustomPostsViews.defaultProps = {
  defaultView: 'new'
};

CustomPostsViews.contextTypes = {
  currentRoute: PropTypes.object,
  intl: intlShape
};

CustomPostsViews.displayName = 'PostsViews';

registerComponent('PostsViews', CustomPostsViews, withCurrentUser, withRouter);
