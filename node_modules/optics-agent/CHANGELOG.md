# Change log

### 1.1.9
* Allow using graphql-tools 2

### 1.1.8
* Allow using graphql 0.11.x

### 1.1.7
* Fixed an issue where request retries would print superfluous errors to the console.

### 1.1.4
* Community support for koa2, thanks to tychota and sibelius
* Ugprade to graphql-tools 1.x
* package.json: prepublish->prepare in scripts

### 1.1.3
* Support for graphql-js 0.10.0.

### 1.1.2
* Retry requests (which are all idempotent) instead of giving up on first failure.

### 1.1.1
* Update peer dependencies to include graphql 0.9.x.

### 1.1.0
* Fix an issue that introduced promises that would throw but the app could not handle.
* Support for Koa.
* Dependency updates.
  TypeScript users might have to migrate from `typed-graphql` to `@types/graphql`
  due to https://github.com/apollographql/graphql-tools/pull/249
* `shutdownGracefully` option (default true): send one last stats report on process.exit() and SIGINT.

### 1.0.4
* Dependency updates.

### 1.0.3
* Support `HTTPS_PROXY` and a proxyUrl option.

### 1.0.2
* Fix encoding issue for query variables in traces.

### 1.0.1
* Fix issue where fragments were not properly reported in stats.

### 1.0.0

Initial production release
