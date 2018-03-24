# webpack-require-weak

> Require a webpack resolveWeak id

```js
const isWebpackBundle = require('is-webpack-bundle');
const webpackRequireWeak = require('webpack-require-weak');

let myModule;

if (isWebpackBundle) {
  myModule = webpackRequireWeak(require.resolveWeak('./path/to/module'));
} else {
  myModule = require('./path/to/module');
}
```
