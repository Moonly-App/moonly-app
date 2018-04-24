Package.describe({
  name: "login-popup"
});

Package.onUse( function(api) {

  api.use([
    // vulcan core
    'vulcan:core@1.8.0',
    'example-forum',

    // vulcan packages
    'vulcan:accounts@1.8.0',
    'vulcan:events',
    'session'
  ]);
  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');
});
