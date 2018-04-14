import { Components, registerComponent, replaceComponent, getRawComponent, getFragment, withMessages, withCurrentUser } from 'meteor/vulcan:core';
import {Posts, Categories, getCategories} from "meteor/example-forum";
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'meteor/vulcan:i18n';
import { withRouter } from 'react-router'
import { withApollo } from 'react-apollo';
import fieldCollection from "../customFields.js";

const CustomPostsNewForm = (props, context) => {
  return (
  <Components.ShowIf
  check={Posts.options.mutations.new.check}
  failureComponent={<div><p className="posts-new-form-message"><FormattedMessage id="posts.sign_up_or_log_in_first" /></p><Components.AccountsLoginForm /></div>}
  >
  <div className="posts-new-form">
  <Components.SmartForm
  collection={Posts}
  fields={fieldCollection[props.fields]}
  mutationFragment={getFragment('PostsPage')}
  successCallback={post => {
    props.closeModal();
    props.router.push({pathname: props.redirect || Posts.getPageUrl(post)});
    props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
  }}
  />
  </div>
  </Components.ShowIf>)
}

CustomPostsNewForm.propTypes = {
  apolloClient: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  closeModal: React.PropTypes.func,
  router: React.PropTypes.object,
  flash: React.PropTypes.func,
  redirect: React.PropTypes.string,
}

CustomPostsNewForm.contextTypes = {
  closeCallback: PropTypes.func,
  intl: intlShape
};

CustomPostsNewForm.displayName = "PostsNewForm";
registerComponent("CustomPostsNewForm", CustomPostsNewForm, withRouter, withMessages, withCurrentUser, withApollo);
