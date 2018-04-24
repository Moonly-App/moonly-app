import { Components, registerComponent, ModalTrigger, replaceComponent, getRawComponent, Utils, getSetting } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { Link } from 'react-router';
import {Posts} from "meteor/example-forum";
import moment from 'moment';

class CustomPostsItem extends getRawComponent('PostsItem') {
  constructor() {
    super();
  }

  renderCategories() {
    return this.props.post.categories && this.props.post.categories.length > 0 ? <Components.PostsCategories post={this.props.post} /> : "";
  }

  renderCommenters() {
    return this.props.post.commenters && this.props.post.commenters.length > 0 ? <Components.PostsCommenters post={this.props.post}/> : "";
  }

  renderActions() {
    return (
      <div className="posts-actions">
        <ModalTrigger title="Edit Post" component={<a className="posts-action-edit"><FormattedMessage id="posts.edit"/></a>}>
          <Components.PostsEditForm post={this.props.post} />
        </ModalTrigger>
      </div>
    )
  }



  render() {


    const {post} = this.props;

    let postClass = "posts-item";
    if (post.sticky) postClass += " posts-sticky";

    const thumbBg = {
      backgroundImage: `url(${Posts.getThumbnailUrl(post)})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat"
    };

    const imageBg = {
      backgroundImage: `url(${post.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat"
    };

    let domainFavicon = "http://s2.googleusercontent.com/s2/favicons?domain_url=" + Utils.getDomain(post.url);

   //  console.log(this.renderCategories())

    // let postRef = this.props.post._id;


        return (
      <div className={postClass}>

        <div className="posts-item-content">

          <div className="posts-thumbnail">

            {post.thumbnailUrl
              ? <Link to={Posts.getLink(post)} className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
                  <div style={thumbBg}></div>
                </Link>
              : <a className="posts-thumbnail" href={post.website} target="_blank" style={thumbBg}>
                <div style={imageBg}></div>
              </a>
            }
          </div>
          <div className="postItemAuthorInfo">
            {post.user
              ? <div className="posts-item-user">
                <Components.UsersAvatar user={post.user} size="small"/>
                <div className="dateWrapper">
                <span className="spanBy">by </span><Components.UsersName user={post.user}/>
                <div className="posts-item-date">
                  <a href={Posts.getPageUrl(post)}>{post.postedAt
                      ? moment(new Date(post.postedAt)).fromNow()
                      : ""}</a>
                </div>
                </div>
                </div>
              : null}
            
            
          </div>
          <div className="postInfoWrapper">
            
            <h3 className="posts-item-title">
              {post.website
                ? <a href={post.website} className="posts-item-title-link" target="_blank">
                    {post.title}
                  </a>
                : <Link to={Posts.getLink(post)} className="posts-item-title-link" target={Posts.getLinkTarget(post)}>
                  {post.title}
                </Link>
              }
            </h3>
            {post.url
              ? <span className="post-url-domain"><img src={domainFavicon} alt=""/>{Utils.getDomain(post.url)}</span>
              : null}
            <p className="posts-item-desc-excerpt">{post.excerpt}</p>
            <div className="postItemCats">{this.renderCategories()}</div>
          </div>
          <div className="posts-item-meta">
           <Components.PostsStats post={post} /> 
           {!post.commentCount || post.commentCount === 0 ? <div><a href={Posts.getPageUrl(post)} target="_blank"><Components.Icon name="comments" /><span className="faCommNo">0</span></a></div> :
                  post.commentCount === 1 ? <div><a href={Posts.getPageUrl(post)} target="_blank"><Components.Icon name="comments" /><span className="faCommNo">{post.commentCount}</span></a></div> :
                  <div><a href={Posts.getPageUrl(post)} target="_blank"><Components.Icon name="comments" /> <span className="faCommNo">{post.commentCount}</span></a></div>
                }
            <div className="posts-like-comm">

              <div className="posts-item-vote">
                <Components.Reaction collection={Posts} document={post} currentUser={this.props.currentUser}/>
              </div>
            </div>            
            {Posts.options.mutations.edit.check(this.props.currentUser, post)
              ? this.renderActions()
              : null}
          </div>

        </div>

      </div>
    );
  }
}

CustomPostsItem.propTypes = {
  currentUser: PropTypes.object,
  post: PropTypes.object.isRequired,
  terms: PropTypes.object
};

replaceComponent('PostsItem', CustomPostsItem);
