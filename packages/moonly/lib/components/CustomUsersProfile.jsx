import { Components, registerComponent, withDocument, withCurrentUser, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';
import { Link } from 'react-router';
import {Posts} from "meteor/example-forum";
import { withVote, hasVotedClient } from 'meteor/vulcan:voting';

const CustomUsersProfile = (props) => {
  if (props.loading) {

    return <div className="page users-profile"><Components.Loading/></div>

  } else if (!props.document) {

    console.log(`// missing user (_id/slug: ${props.documentId || props.slug})`);
    return <div className="page users-profile"><FormattedMessage id="app.404"/></div>

  } else {

    const user = props.document;
    const post = props.document;

    const terms = {view: "userPosts", userId: user._id};
    const terms2 = {view: "userSavedPosts", userId: user._id};

    return (

      <div className="page users-profile">
        <Components.HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} description={user.bio}/>
        <img className="profilePhoto" src={user.avatarUrl}/>
        <h2 className="page-title">{Users.getDisplayName(user)}</h2>
        {user.htmlBio ? <div dangerouslySetInnerHTML={{__html: user.htmlBio}}></div> : null }
        <ul className="userProfileSocials">

          {user.twitterUsername ?
          <li className="usrTwitter">
            <a href={"http://twitter.com/" + Users.getTwitterName(user)}><i className="fa fa-twitter"></i></a>
          </li>
          : null}

          {user.website ?
            <li className="usrWebsite">
              <a href={user.website}><i className="fa fa-globe"></i></a>
            </li>
          : null }
        </ul>
        <h3 className="profilePostTitle"><FormattedMessage id="users.posts"/></h3>
        <Components.PostsList terms={terms} showHeader={false} />
        <h3 className="profilePostTitle">Saved Posts</h3>
        <Components.PostsList terms={terms2} showHeader={false} />
      </div>
    )
  }
}

CustomUsersProfile.propTypes = {
  // document: PropTypes.object.isRequired,
}

CustomUsersProfile.displayName = "UsersProfile";

const options = {
  collection: Users,
  queryName: 'usersSingleQuery',
  fragmentName: 'UsersProfile',
};

registerComponent('UsersProfile', CustomUsersProfile, withCurrentUser, [withDocument, options]);
