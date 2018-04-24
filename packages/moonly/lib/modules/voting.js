import { makeVoteable, addVoteType } from 'meteor/vulcan:voting';
import { Posts } from 'meteor/example-forum';

makeVoteable(Posts);

addVoteType('save', {   power: 1,    exclusive: true});
