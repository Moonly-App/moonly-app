import { makeVoteable, addVoteType } from 'meteor/vulcan:voting';
import Movies from './movies/index.js';

makeVoteable(Movies);

addVoteType('save',    {   power: 1,    exclusive: true});
