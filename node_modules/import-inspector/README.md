# import-inspector

> Wrap dynamic imports with metadata about the import

```js
import {inspect, report} from 'import-inspector';

const stopInspecting = inspect(metadata => {
  console.log(metadata);
});

report(import('./other-module'), { whatever: 42 });
// log: { whatever: 42 }

stopInspecting();
```

## API

#### `inspect(callback)`

Add a callback to be called whenever the `report()` function is called.
Receives `metadata` from `report()`.

Returns a function `stopInspecting()` that will stop the `callback` from being
called again.

#### `report(promise, metadata)`

Wrap an import promise with some metadata to report.
