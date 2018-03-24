import { Components, registerComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';

const CustomPostsStats = ({post}) => {

  return (
    <div className="posts-stats">
      <span className="posts-stats-item" title="Clicks"><img src="/packages/moonly/lib/static/click.png" alt="clicks number"/> <span>{post.clickCount || 0}</span></span>
      <span className="posts-stats-item" title="Upvotes"><Components.Icon name="bookmark" />  <span className="savedNo"> {post.baseScore || 0}</span></span>
    </div>
  )
}

CustomPostsStats.displayName = "PostsStats";

replaceComponent('PostsStats', CustomPostsStats);