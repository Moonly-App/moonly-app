Package.describe({
  name: "moonly"
});

Package.onUse( function(api) {

  api.use([
    'vulcan:core',
    'example-forum',
    'vulcan:voting',
    'vulcan:accounts',
    'vulcan:forms',
    'vulcan:forms-upload',
    'fourseven:scss@4.5.0'
  ]);

  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');

  api.addFiles([
    'lib/stylesheets/custom.scss',
    'lib/stylesheets/instaFilters.css',
    'lib/stylesheets/custom.css',
    'lib/stylesheets/slick-react.min.css',
    'lib/stylesheets/slick-react-theme.min.css',
    'lib/stylesheets/new-design.css',
    'lib/stylesheets/cat-colors.css'
  ], ['client']);



  api.addAssets([
    'lib/static/logo.png',
    'lib/static/add.png',
    'lib/static/arrow.png',
    'lib/static/bookmark.png',
    'lib/static/check.png',
    'lib/static/chrome-color.png',
    'lib/static/chrome.png',
    'lib/static/click-fill.png',
    'lib/static/click.png',
    'lib/static/close.png',
    'lib/static/email.png',
    'lib/static/facebook-color.png',
    'lib/static/facebook.png',
    'lib/static/fill1.png',
    'lib/static/fill3.png',
    'lib/static/fill5.png',
    'lib/static/fill6.png',
    'lib/static/fill7.png',
    'lib/static/fill9.png',
    'lib/static/Group.png',
    'lib/static/link.png',
    'lib/static/logo-1.png',
    'lib/static/logo-2.png',
    'lib/static/ly.png',
    'lib/static/moon.png',
    'lib/static/more.png',
    'lib/static/oval-copy-2.png',
    'lib/static/Oval.png',
    'lib/static/page-1.png',
    'lib/static/reddit.png',
    'lib/static/saved.png',
    'lib/static/search.png',
    'lib/static/share.png',
    'lib/static/slack.png',
    'lib/static/time-fill.png',
    'lib/static/time.png',
    'lib/static/trend-fill.png',
    'lib/static/trend.png',
    'lib/static/twitter-color.png',
    'lib/static/twitter.png',
    'lib/static/view.png',
    'lib/static/web.png',
    'lib/static/crescent-moon.png',
    'lib/static/oksign.png',
    'lib/static/timerclock.png',
    'lib/static/trophy.png'
  ], ['client']);

});
