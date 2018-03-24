Install the NPM package in your app:

```
$ npm install optics-agent --save
```

Set the `OPTICS_API_KEY` environment variable to the API key shown above.

Import the package in your main js file:

```js
import OpticsAgent from 'optics-agent';
```

Instrument your schema:
```js
OpticsAgent.instrumentSchema(executableSchema);
```

Add the middleware:
```js
expressServer.use(OpticsAgent.middleware());
```

Add to your GraphQL context object:
```js
context.opticsContext = OpticsAgent.context(req);
```

For more details, see [the optics-agent-js README](https://github.com/apollostack/optics-agent-js/blob/master/README.md).
