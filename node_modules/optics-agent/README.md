# optics-agent-js
Apollo Optics agent for GraphQL-js

Here are the steps to enable Apollo Optics agent in your app. See below for details on each step:
* Install the NPM package in your app: `npm install optics-agent --save`
* Import the package in your main js file: `import OpticsAgent from 'optics-agent';`
* Get an API key from the Optics web interface and configure the agent. Either:
  * Set the `OPTICS_API_KEY` environment variable to your API key
  * Set the API key and more with `OpticsAgent.configureAgent({ options });`
* Instrument your app. In any order:
  * Instrument your schema: `OpticsAgent.instrumentSchema(executableSchema);`
  * Add the middleware: `expressServer.use(OpticsAgent.middleware());`
  * Add to your GraphQL context object: `context.opticsContext = OpticsAgent.context(req);`

## Version requirements

Apollo Optics Agent supports:

* Node 4, 5, 6 and 7
* [graphql-js](https://www.npmjs.com/package/graphql): 0.6.2 to 0.10.0.

## Install

First, install the package

```
npm install optics-agent --save
```

## Configure

Next, set up the agent in your main server file.

### Import the package

```js
var OpticsAgent = require('optics-agent');
```

or in ES2015+

```js
import OpticsAgent from 'optics-agent';
```

### [optional] Configure the Agent

```js
OpticsAgent.configureAgent({ configOptions })
```

Normally you do not need to call this function -- just set the `OPTICS_API_KEY` environment variable. Call this function if you set the API key in code instead of through the environment variable, or if you need to set specific non-default values for other options. Call this _before_ any calls to instrumentation functions below.

Options include:

* `apiKey`: String. Your API key for the Optics service. This defaults to the `OPTICS_API_KEY` environment variable, but can be overridden here.

* `reportTraces`: Boolean. Send detailed traces along with usage reports. Defaults to true.

* `reportVariables`: Boolean. Send the query variables along with traces. Defaults to true.

* `printReports`: Boolean. Print a JSON version of reports as they are sent. This may be useful for debugging. Defaults to false.

* `normalizeQuery`: Function([GraphQLResolveInfo](http://graphql.org/graphql-js/type/#graphqlobjecttype))⇒String. Called to determine the query shape for for a GraphQL query. You shouldn't need to set this unless you are debugging.

* `endpointUrl`: String. Where to send the reports. Defaults to the production Optics endpoint, or the `OPTICS_ENDPOINT_URL` environment variable if it is set. You shouldn't need to set this unless you are debugging.

* `proxyUrl`: String. HTTP proxy to use when sending reports. Default to no proxying, or the `HTTPS_PROXY` environment variable if it is set. You should only set this when your servers cannot connect directly to the Optics service.

* `reportIntervalMs`: Number. How often to send reports in milliseconds. Defaults to 1 minute. Minimum 10 seconds. You shouldn't need to set this unless you are debugging.

* `shutdownGracefully`: Boolean. Send statistics when the process exits. Defaults to true.


### Instrument your schema

Call `instrumentSchema` on the same [executable schema object](http://graphql.org/graphql-js/type/#graphqlschema) you pass to the [`graphql` function from `graphql-js`](http://graphql.org/graphql-js/graphql/#graphql):

```js
OpticsAgent.instrumentSchema(executableSchema);
```

You should only call this once per agent. If you have multiple or dynamic schemas, create a separate agent per schema (see below).

### Add the middleware

Set up middleware:

#### Express

Tell your server to run the Optics Agent middleware:

```js
expressServer.use(OpticsAgent.middleware());
```

This must run before the handler that actually executes your GraphQL queries.  For the most accurate timings, avoid inserting unnecessary middleware between the Optics Agent middleware and your GraphQL middleware.

#### HAPI

```js
OpticsAgent.instrumentHapiServer(hapiServer);
```

#### Koa

Koa is not officially supported, but thanks to community contributions should work with:

```js
const schema = OpticsAgent.instrumentSchema(executableSchema);
app.use(OpticsAgent.koaMiddleware());
router.post(
  '/graphql',
  graphqlKoa(async ctx => {
    // create an optic context
    const opticsContext = OpticsAgent.context(ctx.request);
    // create a context for each request
    const context = { opticsContext };
    return {
      schema,
      context,
    };
  })
);
```

### Add a context to each graphql request

Inside your request handler, if you are calling `graphql` directly, add a new
field to the `context` object sent to `graphql`:

```jsjs
{ opticsContext: OpticsAgent.context(req) }
```

If you are using `apolloExpress`, this will be a field on
the
[`context` object on the `ApolloOptions` value that you return](http://dev.apollodata.com/tools/apollo-server/setup.html#options-function).

If you are using HAPI you must explicitly use the raw request object:
```js
{ opticsContext: OpticsAgent.context(request.raw.req) }
```

### Example

Here's an example diff:

https://github.com/apollostack/GitHunt-API/compare/nim/optics-agent

```diff
diff --git a/api/index.js b/api/index.js
index 43ee586..f1a27a6 100644
--- a/api/index.js
+++ b/api/index.js
@@ -19,6 +19,11 @@ import { subscriptionManager } from './subscriptions';

 import schema from './schema';

+import OpticsAgent from 'optics-agent';
+
+OpticsAgent.instrumentSchema(schema);
+
+
 let PORT = 3010;
 if (process.env.PORT) {
   PORT = parseInt(process.env.PORT, 10) + 100;
@@ -33,6 +38,7 @@ app.use(bodyParser.json());

 setUpGitHubLogin(app);

+app.use('/graphql', OpticsAgent.middleware());
 app.use('/graphql', apolloExpress((req) => {
   // Get the query, the same way express-graphql does it
   // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
@@ -70,6 +76,7 @@ app.use('/graphql', apolloExpress((req) => {
       Users: new Users({ connector: gitHubConnector }),
       Entries: new Entries(),
       Comments: new Comments(),
+      opticsContext: OpticsAgent.context(req),
     },
   };
 }));
diff --git a/package.json b/package.json
index 98df047..b110fac 100644
--- a/package.json
+++ b/package.json
@@ -52,6 +52,7 @@
     "graphql-tools": "0.7.2",
     "knex": "0.12.3",
     "lodash": "4.16.4",
+    "optics-agent": "0.0.33",
     "passport": "0.3.2",
     "passport-github": "1.1.0",
     "request-promise": "4.1.1",
```

## Advanced Usage

If you need to have more than one Agent per process, you can manually construct an Agent object instead of using the default global Agent. Call `new OpticsAgent.Agent(options)` to instantiate the object, and then call methods directly on the object instead of on `OpticsAgent`. Here is an example:

```js
var OpticsAgent = require('optics-agent');
var agent = new OpticsAgent.Agent({ apiKey: '1234' });
agent.instrumentSchema(schema);
```

## Troubleshooting

The Optics agent is designed to allow your application to continue working, even if the agent is not configured properly.

### No data in Optics

If there is no data being sent to Optics, check your application logs to look for the following messages:

### Message: Please check the API key in the Optics agent configuration.

Solution: Get a valid API key from Optics and configure it in your GraphQL server.

### Message: no API key specified. Set the apiKey option or set the OPTICS_API_KEY environment variable

Solution: Check the API key provided for this endpoint in Optics, and set it in your GraphQL server configuration

### Message: schema not instrumented. Make sure instrumentSchema is called

Solution: In your server code, call instrumentSchema on the schema object you pass to the graphql function from graphql-js.
`OpticsAgent.instrumentSchema(executableSchema);`

### Message: Optics context not found. Make sure optics middleware is installed.

Solution: In your server code, set up the Optics middleware.
`app.use(OpticsAgent.middleware())`
