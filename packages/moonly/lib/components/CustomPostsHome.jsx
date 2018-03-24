import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';

const CustomPostsHome = (props, context) => {
  const terms = _.isEmpty(props.location && props.location.query) ? {view: 'new'}: props.location.query;
  return <Components.PostsList terms={terms}/>
};

CustomPostsHome.displayName = "PostsHome";

registerComponent('PostsHome', CustomPostsHome);
