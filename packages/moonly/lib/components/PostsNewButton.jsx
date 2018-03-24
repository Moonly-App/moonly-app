import { Components, replaceComponent, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import Button from 'react-bootstrap/lib/Button';
const PostsNewButton = (props, context) => {

  const size = props.currentUser ? 'large' : 'small';
  const button = <Button className="posts-new-button" bsStyle="primary"><Components.Icon name="new"/><span>New Post</span></Button>;
    return (
      <Components.ModalTrigger size={size} title="New Post" component={button}>
        <Components.CustomPostsNewForm fields="posts" />
      </Components.ModalTrigger>
    )
}

PostsNewButton.displayName = 'PostsNewButton';

PostsNewButton.propTypes = {
  currentUser: PropTypes.object,
};

PostsNewButton.contextTypes = {
  messages: PropTypes.object,
  intl: intlShape
};

replaceComponent('PostsNewButton', PostsNewButton, withCurrentUser);
