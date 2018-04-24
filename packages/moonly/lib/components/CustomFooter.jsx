import { registerComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const CustomFooter = props => {
  return (
    <div className="footer">Crafted by <a href="https://vanila.io" target="_blank">Vanila.io</a></div>
  )
}

CustomFooter.displayName = "Footer";

replaceComponent('Footer', CustomFooter);
