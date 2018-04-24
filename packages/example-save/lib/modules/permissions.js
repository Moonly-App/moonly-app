/*

Posts permissions

*/

import Users from 'meteor/vulcan:users';

const membersActions = [
  'movies.new',
  'movies.edit.own',
  'movies.remove.own',
  'movies.save'
];
Users.groups.members.can(membersActions);
