import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { Components, withCurrentUser } from 'meteor/vulcan:core';

const AccountsLoginForm = () => {
  return (
    <div>
      <Components.CustomAccountsLoginForm />
    </div>
  )
}

registerComponent('AccountLoginPage', AccountsLoginForm);
