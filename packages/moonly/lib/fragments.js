import { extendFragment } from 'meteor/vulcan:core';

extendFragment('PostsList', `
  image
  sticky
  clickCount
`);

extendFragment('PostsPage', `
  image
  sticky
  clickCount
`)
;
