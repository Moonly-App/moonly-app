import {Components, replaceComponent} from 'meteor/vulcan:core';
import React from 'react';
import {FormattedMessage} from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';

const PostsLoadMore = ({loading, loadMore, count, totalCount}) => {
  let onClickHandler = (e) => {
    e.preventDefault();
    loadMore();
    console.log('Loading Moaaar')
  }
  let onScrollHandler = (e) => {

    function didScroll(e) {
      let scrolled;
      try {
        scrolled = (e.event.type === "scroll" && e.currentPosition === "inside" && e.previousPosition === "below");
      } catch (e) {
        //
      }
      return scrolled;
    }

    if (didScroll(e)) {
      loadMore();
      console.log('Loading Moaaar')
    }
  }

  return (
    <Waypoint onEnter={onScrollHandler}>
      <div className={classNames('posts-load-more', {'posts-load-more-loading': loading})}>
        {loading
          ? <div className="posts-load-more-loader"><Components.Loading/></div>
          : null}
      </div>
    </Waypoint>
  )
}

PostsLoadMore.displayName = "PostsLoadMore";

replaceComponent('PostsLoadMore', PostsLoadMore);
