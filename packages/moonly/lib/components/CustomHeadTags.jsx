import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { registerComponent, Utils, getSetting, Head, replaceComponent, getRawComponent } from 'meteor/vulcan:lib';

class CustomHeadTags extends getRawComponent("HeadTags") {
  componentDidMount() {
    /*fbAsyncInit = function() {
        FB.init({
          appId      : '1472882479415624',
          xfbml      : true,
          version    : 'v2.10'
        });
        FB.AppEvents.logPageView();
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));


         console.log("this work?");
*/
  }
  render() {

    const url = !!this.props.url ? this.props.url : Utils.getSiteUrl();
    const title = !!this.props.title ? this.props.title : getSetting("title", "My App");
    const description = !!this.props.description ? this.props.description : getSetting("description") || getSetting("tagline");

    // default image meta: logo url, else site image defined in settings
    let image = !!getSetting("siteImage") ? getSetting("siteImage"): getSetting("logoUrl");

    // overwrite default image if one is passed as props
    if (!!this.props.image) {
      image = this.props.image;
    }

    // add site url base if the image is stored locally
    if (!!image && image.indexOf('//') === -1) {
      image = Utils.getSiteUrl() + image;
    }

    return (
      <div>
        <Helmet>

          <title>{title}</title>

          <meta charSet="utf-8"/>
          <meta name="description" content={description}/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>

          {/* facebook */}
          <meta property="og:type" content="article"/>
          <meta property="og:url" content={url}/>
          <meta property="og:image" content={image}/>
          <meta property="og:title" content={title}/>
          <meta property="og:description" content={description}/>

          {/* twitter */}
          <meta name="twitter:card" content="summary"/>
          <meta name="twitter:image:src" content={image}/>
          <meta name="twitter:title" content={title}/>
          <meta name="twitter:description" content={description}/>

          <link rel="canonical" href={url}/>
          <link name="favicon" rel="shortcut icon" href={getSetting("faviconUrl", "/img/favicon.ico")}/>


          {Head.meta.map((tag, index) => <meta key={index} {...tag}/>)}
          {Head.link.map((tag, index) => <link key={index} {...tag}/>)}
          {Head.script.map((tag, index) => <script key={index} {...tag}/>)}

        </Helmet>

      </div>
    );
  }
}

CustomHeadTags.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

replaceComponent('HeadTags', CustomHeadTags);

export default CustomHeadTags;
