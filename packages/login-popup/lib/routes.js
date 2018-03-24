import {addRoute} from 'meteor/vulcan:core';

addRoute([
  {
    name: 'login',
    path: 'popup/login',
    componentName: 'AccountLoginPage',
    layoutName: "AccountLoginLayout"
  }
]);
