import { Components, registerComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import {Posts} from "meteor/example-forum";

const CustomPostsCommenters = ({post}) => {
  return (
    <div className="posts-commenters">

      <div className="posts-commenters-discuss">
        <Link to={Posts.getPageUrl(post)}>

          <span className="posts-commenters-comments-count">{post.commentCount}</span>
          <Components.Icon name="comment" />
        </Link>
      </div>
    </div>
  );
};

CustomPostsCommenters.displayName = "PostsCommenters";

replaceComponent('PostsCommenters', CustomPostsCommenters);
