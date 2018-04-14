/*
The original Logo components is defined using React's
functional stateless component syntax, so we redefine
it the same way.
*/

import React from 'react';
import { IndexLink } from 'react-router';
import Users from 'meteor/vulcan:users';
import { replaceComponent } from 'meteor/vulcan:core';

const CustomLogo = ({logoUrl, siteTitle, currentUser}) => {
  return (
    <div className="logoWrapper">
      <h1 className="logo">
      <IndexLink to="/"><img src="/packages/moonly/lib/static/logo.png" alt="Moon.ly logo"/></IndexLink>
      </h1>
    </div>
  )
}

replaceComponent('Logo', CustomLogo);
