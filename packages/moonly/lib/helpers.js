import { Utils } from 'meteor/vulcan:lib';
import Users from 'meteor/vulcan:users';

Users.getTwitterName = function (user) {
  // return twitter name provided by user, or else the one used for twitter login
  if (typeof user !== "undefined") {
    if (user.twitterUsername) {
      return user.twitterUsername;
    } else if(Utils.checkNested(user, 'services', 'twitter', 'screenName')) {
      return user.services.twitter.screenName;
    }
  }
  return null;
};
