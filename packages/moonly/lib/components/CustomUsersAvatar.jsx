import { registerComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Users from 'meteor/vulcan:users';
import { Link } from 'react-router';
import classNames from 'classnames';

const CustomUsersAvatar = ({className, user, link}) => {

  const avatarUrl = user.avatarUrl || Users.avatar.getUrl(user);

  const img = <img alt={Users.getDisplayName(user)} className="avatar-image" src={avatarUrl} title={user.username}/>;
  const initials = <span className="avatar-initials"><span>{Users.avatar.getInitials(user)}</span></span>;

  const avatar = avatarUrl ? img : initials;

  return (
    <div className={classNames('avatar', className)}>
       <span>{avatar}</span>
    </div>
  );

}

CustomUsersAvatar.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.string,
  link: PropTypes.bool
}

CustomUsersAvatar.defaultProps = {
  size: 'medium',
  link: true
}

CustomUsersAvatar.displayName = 'UsersAvatar';

replaceComponent('UsersAvatar', CustomUsersAvatar);
