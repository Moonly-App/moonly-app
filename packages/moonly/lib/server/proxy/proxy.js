// FIXME: THIS FILE POSSES A SECURITY THREAT, WE NEED IT FOR OUR EXTENSION UNTIL WE HAVE A BETTER WAY TO GET/POST DATA FROM EXTENSION

var express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  app = express();

var myLimit = process.env.PROXYJSONLIMIT || '100kb';
var port = process.env.PROXYPORT || 8500;

app.use(bodyParser.json({limit: myLimit}));
app.all('*', function(req, res, next) {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  if (req.method === 'OPTIONS') {
    // CORS Preflight
    res.send();
  } else {
    var targetURL = `http://0.0.0.0:${process.env.PORT}`;
    if (!targetURL) {
      res.send(500, {error: 'There is no Target-Endpoint header in the request'});
      return;
    }
    request({
      url: targetURL + req.url,
      method: req.method,
      json: req.body,
      headers: {
        'Authorization': req.header('Authorization')
      }
    }, function(error, response, body) {
      if (error) {
        console.error('error: ' + response.statusCode)
      }
      // console.log(body);
    }).pipe(res);
  }
});

app.set('port', port);

app.listen(app.get('port'), function() {
  console.log('Proxy server listening on port ' + app.get('port'));
});

let key = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAo2SPf/qRPrYwFjhKNZX/pUwq8BnmV1asjlxIQc3iWchS3RjX
NRalm3knhzvh4Zz7ucaPNzwH6RMQXTnk3tm6x8G5dLVueknxmQISm7MFBHeRBXWh
cwNYU8m20ZXxkxXEIP7XYfdWRQY9SaWF9SmI2ky+bfy3ML6eXS05KvEBlEogPoIj
JwPzxP2H8/cjcnwsUlSn39VUf+aCnXYYaAYtIxk1QQcUMusCBSW5TF180vg2zkiI
/kNorgp9OharclRG75tA6FFLxHg0FLVvBDPJu01eCOgjdyE/Hvs4GKFiFj0ziX1D
i+YGqQELtc5rdyOna0cCEE/GKDsXsjOhgYw6QwIDAQABAoIBAGhinV7oqJRE9rGr
YpWbb8idwazFDyhrIjCM+ki4DMzJM083SH4NKt4J59v4wNVPYm6MUQC7pF4eJM06
aGKK/U4TELVkF+Geje/vqA26sBDrhkXTocKFt49IBjkdr0kFldhylw1qY74TP2Jm
kg9ParP0ZZCE7FAC58+lTamGcTjXoPJOpLv87py2OzeidMhMUYTS9WC+EB9dxrKd
nyBvXrmyM2RxpPGy85Kuyw3TNhvksEdIhxuPUTP5gHVte2sqxiCG33SNEIqjf89n
xjD0VlCcL03Z+zzaQiJOVkWZhvGf96Q2PNO6TfnsawwFDth4nmU6Ft8jsLhL/0XA
PFaeO0ECgYEA1ZHFVBfK/dbTaY42T2x1hKsyIyvj9pQrmHKAvua1CeQZfq0Eh0Mt
X8EDGrdPuntu13sZABxq8wWeKykHNwHK8NklZE4GGNod2ChArX+FGkrjzWaK/J7T
QgPaQOshtxotmsF+eM6mmVoiLYgTiLs6ZeFX8CpmUaDSd5PrOsByfiECgYEAw9rJ
cmSsCM6wY6+GPQUbtSPh1Xf4k5POlxWM3SCljQRhptLiF+miGXXyPqH6T1fnmuQF
yjgcF2dvme9F51kTHtS1BcxfdHyy3fgvlMNhoZJ6bcOcmwFuvK0RfihYdztvsAn5
vDSr8H7MWQsBl6Wm+LsFzvUNu3R7A4na2DsMA+MCgYB81wH3HxVcfkgEasnacXbc
f0oGfzB5QbGeIkiZzrhCuOAiSTbdbmpGj8elxUPIqUBomx9JDlOCDWWgqxH5mIWt
dfFCic1Ml6tcYGM2R9VhQieZOHjEJH8vFpts2UVTB+1iifrI2VtPRv21idaJVZBU
X34M+GvpCU4d8gxNwpLqoQKBgBFnn/9Kcv9VXtd9AbDqg0vVpHwT7UMwH2vNvnbo
L84YVZU9qFn3qTAaCy0Ft/jVFv/sw5b05You5vwHB29HuytCO9QIFXOEoWCYbaIK
uuJg4gBfIcuklPKvbp6Hd1UhMwux1z+ibqUwn3hKQhn33p68AAgkPtQpxcTKu2f7
11WBAoGAWqEfUMzFjuJqlpmtb2px41d8Ax5VdaqdbAWhOyGQPKzD8ylaQlzx3/aN
L4Guf/bmQHiTwp0z5dGLsuDSQT4m7tM2TscrJGu+CBaT3kiDwga3H8PIkwovHLVM
8iGOSJLxtbJL6saXsF3iTnVV82VxQ8yM74N0GPtFSs+8IVrJObY=
-----END RSA PRIVATE KEY-----
`;

let cert = `-----BEGIN CERTIFICATE-----
MIIC+zCCAeOgAwIBAgIJAKtXfBLHBSUZMA0GCSqGSIb3DQEBCwUAMBQxEjAQBgNV
BAMMCWxvY2FsaG9zdDAeFw0xNzA5MjcxOTQ5MjlaFw0yNzA5MjUxOTQ5MjlaMBQx
EjAQBgNVBAMMCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAKNkj3/6kT62MBY4SjWV/6VMKvAZ5ldWrI5cSEHN4lnIUt0Y1zUWpZt5J4c7
4eGc+7nGjzc8B+kTEF055N7ZusfBuXS1bnpJ8ZkCEpuzBQR3kQV1oXMDWFPJttGV
8ZMVxCD+12H3VkUGPUmlhfUpiNpMvm38tzC+nl0tOSrxAZRKID6CIycD88T9h/P3
I3J8LFJUp9/VVH/mgp12GGgGLSMZNUEHFDLrAgUluUxdfNL4Ns5IiP5DaK4KfToW
q3JURu+bQOhRS8R4NBS1bwQzybtNXgjoI3chPx77OBihYhY9M4l9Q4vmBqkBC7XO
a3cjp2tHAhBPxig7F7IzoYGMOkMCAwEAAaNQME4wHQYDVR0OBBYEFPfE8eXfPEUM
OjuJRnNY51h1l3Z+MB8GA1UdIwQYMBaAFPfE8eXfPEUMOjuJRnNY51h1l3Z+MAwG
A1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAJxnjPZzL4aXzz74c2fWLr3l
GsPBYBkh7hgMrxCq+iz4w7c2HqhIhG//iLPD0cHOEOJ/0gqfYr7S7y+afacYzYhX
7X4/L5d/eK8y7aH1Pwub1wolL5MED7Bn8Dmiu65LDIoj5MHKhG1pD6ln2Hhyy5gj
RdTgC4F18OdvT4zphW41T/aSZ1VCd80loh+xTPQ0JusrfhS4dCXXh31MQlWlySw3
Lmcn8hJ6OVpy82ZhZrxIl7h/42QoWMnrxukyHK03njcmKnvdTosiXUBrvpHDU2su
GuMJY6jrpLwm2bY4L7FVYNIDhJJyhG2FrzCJgZGEnvjIM5QG75PwfVoTjjvp40o=
-----END CERTIFICATE-----
`;

if (process.env.NODE_ENV === "development") {
  var https = require('https');
  var options = {
    key: key,
    cert: cert,
    requestCert: false,
    rejectUnauthorized: false
  };
  var server = https.createServer(options, app);
  server.listen((process.env.PROXYHTTPSPORT || 8501), function() {
    console.log('HTTPS Proxy server listening on port ' + server.address().port);
  });
}
