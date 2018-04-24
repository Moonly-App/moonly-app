import { makeVoteable, addVoteType } from 'meteor/vulcan:voting';
import { Posts } from './posts/index.js';
import { Comments } from './comments/index.js';

makeVoteable(Posts);
makeVoteable(Comments);

addVoteType('save', {   power: 0,    exclusive: false});
