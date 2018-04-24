import { registerFragment } from 'meteor/vulcan:core';

// ------------------------------ Vote ------------------------------ //

// note: fragment used by default on the UsersProfile fragment
registerFragment(`
  fragment VotedItem on Vote {
    # vulcan:voting
    documentId
    power
    votedAt
  }
`);

// ------------------------------ Users ------------------------------ //

// note: fragment used by default on UsersProfile, PostsList & CommentsList fragments
registerFragment(`
  fragment UsersMinimumInfo on User {
    # vulcan:users
    _id
    slug
    username
    displayName
    emailHash
    avatarUrl
  }
`);

registerFragment(`
  fragment UsersProfile on User {
    # vulcan:users
    ...UsersMinimumInfo
    createdAt
    isAdmin
    bio
    htmlBio
    twitterUsername
    website
    groups
    karma
    # vulcan:posts
    postCount
    # vulcan:comments
    commentCount
    votes(collectionName: "Posts"){
      _id
      voteType
      collectionName
      power
      documentId
    }
  }
`);

registerFragment(`
  fragment SaveFragment on Post {
    _id
    createdAt
    userId
    user {
      displayName
    }
    name
    year
    review
    currentUserVotes{
      _id
      voteType
      power
    }
    baseScore
  }
`);

registerFragment(`
  fragment UserSavedPosts on User {
    _id
    reactedMovies{
      _id
      createdAt
      name
      year
      review
      currentUserVotes{
        _id
        voteType
        power
      }
      baseScore
    }
  }
`);
