import {registerComponent, replaceComponent} from 'meteor/vulcan:core';
import React from 'react';
import {Posts} from "meteor/example-forum";

const CustomPostsThumbnail = ({post}) => {
  return (
    <div className="posts-thumbnail">
      <span><img src={Posts.getThumbnailUrl(post)} /></span>
    </div>
  )
};

CustomPostsThumbnail.displayName = "PostsThumbnail";

replaceComponent('PostsThumbnail', CustomPostsThumbnail);
