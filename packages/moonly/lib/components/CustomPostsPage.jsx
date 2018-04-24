import { Utils, Components, registerComponent, withDocument, withCurrentUser, getActions, withMutation, getRawComponent, replaceComponent, ModalTrigger } from 'meteor/vulcan:core';
import {Posts} from "meteor/example-forum";
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { Link } from 'react-router';
import moment from 'moment';


class CustomPostsPage extends getRawComponent("PostsPage") {

  renderCategories() {
    return this.props.document.categories && this.props.document.categories.length > 0
      ? <Components.PostsCategories post={this.props.document}/>
      : "";
  }

  renderActions() {
    return (
      <div className="posts-actions">
        <ModalTrigger title="Edit Post" component={<a className="posts-action-edit"><FormattedMessage id="posts.edit"/></a>}>
          <Components.PostsEditForm post={this.props.document} />
        </ModalTrigger>
      </div>
    )
  }



  render() {

   

    if (this.props.loading) {

      return <div className="posts-page"><Components.Loading/></div>

    } else if (!this.props.document) {

      console.log(`// missing post (_id: ${this.props.documentId})`);
      return <div className="posts-page"><FormattedMessage id="app.404"/></div>

    } else {
      const post = this.props.document;

       let domainFavicon = "http://s2.googleusercontent.com/s2/favicons?domain_url=" + Utils.getDomain(post.url);

      const htmlBody = {
        __html: post.htmlBody
      };
      console.log(Utils.getSiteUrl('posts.list') + this.props.router);
      
      return (
        <div className="posts-page">

          <div className="posts-content-wrapper">
            <Components.HeadTags url={Posts.getPageUrl(post, true)} title={post.title} image={post.thumbnailUrl} description={post.excerpt}/>
            <h1 className="posts-item-title">
              {post.website
                ? <strong className="posts-item-title-link" target="_blank">
                    {post.title}
                  </strong>
                : <strong className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
                  {post.title}
                </strong>
              }
            </h1>
            {post.url
              ? <span className="post-url-domain"><img src={domainFavicon} alt=""/>{Utils.getDomain(post.url)}</span>
              : null}
              
               <div className="post-page-cats">
                {this.renderCategories()}
              </div>
              
            <div className="posts-thumbnail nashville">
              {post.thumbnailUrl
                ? <Components.PostsThumbnail post={post}/>
                :
                  <img src={post.image}/>
              }
            </div>
            {post.htmlBody
              ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div>
              : null}
              <div className="posts-item-meta">
                <div className="posts-like-comm">

                  <div className="posts-item-vote">
                    <Components.Reaction collection={Posts} document={post} currentUser={this.props.currentUser}/>
                  </div>

                </div>
                {Posts.options.mutations.edit.check(this.props.currentUser, post)
                  ? this.renderActions()
                  : null}
                  {post.user
              ? <div className="posts-item-user">
                <Components.UsersAvatar user={post.user} size="small"/>
                <div className="dateWrapper">
                <span className="spanBy">by </span><Components.UsersName user={post.user}/>
                <div className="posts-item-date">
                  <a href={Posts.getPageUrl(post)} target="_blank"><span className="middot">&middot; </span>{post.postedAt
                      ? moment(new Date(post.postedAt)).fromNow()
                      : ""}</a>
                </div>
                </div>
                </div>
              : null}
                  {post.website
                ? <a className="visitEthSite" href={post.website}>Visit Site</a>
                : <Link to={Posts.getLink(post)} className="visitEthSite" target={Posts.getLinkTarget(post)}>
                  Visit Original website
                </Link>
              }
              
              </div>
              <div className="posts-item-meta">
              <Components.PostsStats post={post} /> 
              {!post.commentCount || post.commentCount === 0 ? <div><a href={Posts.getPageUrl(post)} target="_blank"><Components.Icon name="comments" /><span className="faCommNo">0</span></a></div> :
                      post.commentCount === 1 ? <div><a href={Posts.getPageUrl(post)} target="_blank"><Components.Icon name="comments" /><span className="faCommNo">{post.commentCount}</span></a></div> :
                      <div><a href={Posts.getPageUrl(post)} target="_blank"><Components.Icon name="comments" /> <span className="faCommNo">{post.commentCount}</span></a></div>
                    }
                           
                
              </div>
              

              <Components.PostsCommentsThread terms={{postId: post._id, view: 'postComments'}} />

              

          </div>
          {/*<Components.PostsCommentsThread terms={{postId: post._id, view: 'postComments'}} />*/}

        </div>
      );

    }
  }

  // triggered after the component did mount on the client
  async componentDidMount() {
    try {

      // destructure the relevant props
      const {
        // from the parent component, used in withDocument, GraphQL HOC
        documentId,
        // from connect, Redux HOC
        setViewed,
        postsViewed,
        // from withMutation, GraphQL HOC
        increasePostViewCount
      } = this.props;

      // a post id has been found & it's has not been seen yet on this client session
      if (documentId && !postsViewed.includes(documentId)) {

        // trigger the asynchronous mutation with postId as an argument
        await increasePostViewCount({postId: documentId});

        // once the mutation is done, update the redux store
        setViewed(documentId);
      }

    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  }
}

CustomPostsPage.displayName = "PostsPage";

CustomPostsPage.propTypes = {
  documentId: PropTypes.string,
  document: PropTypes.object,
  postsViewed: PropTypes.array,
  setViewed: PropTypes.func,
  increasePostViewCount: PropTypes.func
}

const queryOptions = {
  collection: Posts,
  queryName: 'postsSingleQuery',
  fragmentName: 'PostsPage'
};

const mutationOptions = {
  name: 'increasePostViewCount',
  args: {
    postId: 'String'
  }
};

const mapStateToProps = state => ({postsViewed: state.postsViewed});
const mapDispatchToProps = dispatch => bindActionCreators(getActions().postsViewed, dispatch);

replaceComponent(
// component name used by Vulcan
'PostsPage',
// React component
CustomPostsPage,
// HOC to give access to the current user
withCurrentUser,
// HOC to load the data of the document, based on queryOptions & a documentId props
[
  withDocument, queryOptions
],
// HOC to provide a single mutation, based on mutationOptions
withMutation(mutationOptions),
// HOC to give access to the redux store & related actions
connect(mapStateToProps, mapDispatchToProps));
