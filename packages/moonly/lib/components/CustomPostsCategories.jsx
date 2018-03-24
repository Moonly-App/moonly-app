import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';

const CustomPostsCategories = ({post}) => {
  return (
    <div className="posts-categories">
      {post.categories.map(category => 
        <Link className="posts-category" key={category._id} to={{pathname: "/", query: {cat: category.slug}}}><span className={category.slug}>{category.name}</span></Link>
      )}
    </div>
  )
};

CustomPostsCategories.displayName = "PostsCategories";

registerComponent('PostsCategories', CustomPostsCategories);