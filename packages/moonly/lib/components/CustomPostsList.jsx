import { Components, replaceComponent, registerComponent, withList, withCurrentUser,withDocument,  Utils } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { Posts } from 'meteor/example-forum';
import Alert from 'react-bootstrap/lib/Alert'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import { getSetting } from 'meteor/vulcan:core';
import Slider from 'react-slick';
import { Link, withRouter } from 'react-router';


const Error = ({error}) => <Alert className="flash-message" bsStyle="danger"><FormattedMessage id={error.id} values={{value: error.value}}/>{error.message}</Alert>

const CustomPostsList = ({ className, results, loading, count, totalCount, loadMore, showHeader = true, showLoadMore = true, networkStatus, currentUser, error, terms}) => { 

  const loadingMore = networkStatus === 2;

  if (results && results.length) {

    const hasMore = totalCount > results.length;

    
    
/*
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow:1,
      slidesToScroll: 1,
      arrows: false, 
      swipe:true,
      swipeToSlide:true, 
      vertical: true
    };
*/
    return (
      <div className={classNames(className, 'posts-list', `posts-list-${terms.view}`)}>
        {showHeader ? <Components.PostsListHeader/> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        {/*<div className="row rowFeatured-banners">
            <div className="col-md-9">featured</div>
            <div className="col-md-3">
              <div className="bannerOne">
                <p>
                  <img src="/packages/moonly/lib/static/logo.png" alt=""/>
                  <strong>moon.</strong>ly
                  <p>Where <strong>Marketers</strong> Share and Discover Stellar Marketing Content</p>
                  <button>Add moon to chrome tab</button>
                </p>
              </div>
              <div className="bannerTwo">
              <img src="/packages/moonly/lib/static/logo.png" alt=""/>
                  <strong>moon.</strong>ly
                  <p>Where <strong>Marketers</strong> Share and Discover Stellar Marketing Content</p>
                  <button>Add moon to chrome tab</button>
              </div>
            </div>
    </div>*/}
     {/* <h2 className="homeTaglines taglineExclusive">Exclusive</h2>
      <div id="stickyCarousel">
        <Slider {...settings}>
          {results.map(post => <div className="padTop20"><Components.CustomStickyPosts post={post} key={post._id} currentUser={currentUser} terms={terms} /></div> )}
        </Slider>
      </div>*/}
      <div id="moonlyCta">
        <div className="bannerWrapper bannerWrapperOne">
          <div className="bannerLeft">
          <h1>Discover Best Content for You</h1>
          <h2>Moon.ly is a Google Chrome extension that shows <br/> curated content upon opening Chrome or a new tab.</h2>
          </div>
          <div className="bannerRight">
          <a className="extButton" href="https://chrome.google.com/webstore/detail/moonly/dhmlakjgmklnkaopkdnnmecknpnkncjh" target="_blank"><img src="/packages/moonly/lib/static/chrome.png" alt="moonly chrome extension"/> Add Moonly New Tab <br/> to Chrome</a>
          <a href="https://chrome.google.com/webstore/detail/moonly/dhmlakjgmklnkaopkdnnmecknpnkncjh" target="_blank">or click here to go on Chrome Store</a>
          </div>
        </div>  
        
      </div>
      <Components.PostsViews />
        <div className="posts-list-content">         
          {results.map(post => <Components.PostsItem post={post} key={post._id} currentUser={currentUser} terms={terms} />)}
        </div>
        {showLoadMore ?
          hasMore ?
            <Components.PostsLoadMore loading={loadingMore} loadMore={loadMore} count={count} totalCount={totalCount} /> :
            <Components.PostsNoMore/> :
          null
        }
      </div>
    )
  } else if (loading) {
    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <Components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <Components.PostsNoResults/>
        </div>
      </div>
    )
  }

};

CustomPostsList.displayName = "PostsList";

CustomPostsList.propTypes = {
  results: PropTypes.array,
  terms: PropTypes.object,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  count: PropTypes.number,
  totalCount: PropTypes.number,
  loadMore: PropTypes.func,
  showHeader: PropTypes.bool,
  documentId: PropTypes.string,
  document: PropTypes.object,
};

CustomPostsList.contextTypes = {
  intl: intlShape
};

const options = {
  collection: Posts,
  queryName: 'postsListQuery',
  fragmentName: 'PostsList',
  limit: getSetting('postsPerPage'),
};

replaceComponent('PostsList', CustomPostsList, withCurrentUser, withRouter, [withList, options]);
