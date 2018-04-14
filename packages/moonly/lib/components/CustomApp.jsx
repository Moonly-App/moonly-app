import { Components, registerComponent, registerSetting, getSetting, Strings, replaceComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, intlShape} from 'meteor/vulcan:i18n';
import { withCurrentUser } from 'meteor/vulcan:core';


class CustomApp extends PureComponent {

  getLocale() {
    return getSetting('locale', 'en');
  }

  getChildContext() {
    
    const messages = Strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider({locale: this.getLocale()}, messages);
    const { intl } = intlProvider.getChildContext();
    return {
      intl: intl
    };
  }

  render() {
    
    const currentRoute = _.last(this.props.routes);
    const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    return (
      <IntlProvider locale={this.getLocale()} messages={Strings[this.getLocale()]}>
        <div className="overalWrapper">
          <Components.HeadTags />
          <LayoutComponent {...this.props} currentRoute={currentRoute}>
            { this.props.currentUserLoading ? <Components.Loading /> : (this.props.children ? this.props.children : <Components.Welcome />) }
          </LayoutComponent>
        </div>
      </IntlProvider>
    );
  }
}

CustomApp.propTypes = {
  currentUserLoading: PropTypes.bool,
}

CustomApp.childContextTypes = {
  intl: intlShape,
}

CustomApp.displayName = 'App';

replaceComponent('App', CustomApp, withCurrentUser);

export default CustomApp;
