import { Components, registerComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';

const CustomPostsListHeader = () => {

  return (
    <div>
      
    </div>
  )
}

CustomPostsListHeader.displayName = "PostsListHeader";

replaceComponent('PostsListHeader', CustomPostsListHeader);
