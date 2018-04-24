import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withVote, hasVotedClient } from 'meteor/vulcan:voting';
import { intlShape } from 'meteor/vulcan:i18n';

class Reaction extends PureComponent {

  constructor() {
    super();
    this.vote = this.vote.bind(this);
    this.getActionClass = this.getActionClass.bind(this);
  }

  vote(voteType) {

    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
    } else {
      this.props.vote({document, voteType, collection, currentUser: this.props.currentUser});
    }
  }

  getActionClass() {

    const document = this.props.document;

    const actionsClass = classNames(
      'vote-button',
      {'voted-saved': hasVotedClient({document, voteType: 'save'})}
    );

    return actionsClass;
  }


  render() {
    return (
      <div className={this.getActionClass()}>
        <a className="reaction-button button-save" onClick={e => {e.preventDefault(); this.vote('save')}}>
          <Components.Icon name="bookmark" /> 
        </a>

      </div>
    )
  }

}

Reaction.propTypes = {
  document: PropTypes.object.isRequired, // the document to upvote
  collection: PropTypes.object.isRequired, // the collection containing the document
  vote: PropTypes.func.isRequired, // mutate function with callback inside
  currentUser: PropTypes.object, // user might not be logged in, so don't make it required
};

Reaction.contextTypes = {
  intl: intlShape
};

registerComponent('Reaction', Reaction, withMessages, withVote);
