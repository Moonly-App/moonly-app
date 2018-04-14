import { extendFragment } from 'meteor/vulcan:core';

extendFragment('PostsList', `
  image
  sticky
`);

extendFragment('PostsPage', `
  image
  sticky
`)
;
