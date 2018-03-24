# MessageBox

An NPM package for defining and getting validation error messages in JavaScript. Meteor apps can pass in `Tracker` to get reactive language selection.

## Installation

```bash
$ npm i --save message-box
```

## Usage

### Defining Messages

You can define global defaults if necessary:

```js
MessageBox.defaults({
  initialLanguage: 'en', // optional; default is 'en'
  messages: {
    en: {
      errorType: '{{name}} is invalid' || function,
      errorType: {
        _default: '{{name}} is invalid' || function,
        fieldName: '{{name}} is invalid' || function,
      }
    },
  }
});
```

Otherwise create your `MessageBox` instance like this:

```js
const messageBox = new MessageBox({
  initialLanguage: 'en', // optional; default is 'en'
  messages: {
    en: {
      errorType: '{{name}} is invalid' || function,
      errorType: {
        _default: '{{name}} is invalid' || function,
        fieldName: '{{name}} is invalid' || function,
      }
    },
  }
});
```

And update the `messages` object as necessary (for example if different packages are adding their own messages for different languages):

```js
messageBox.messages({
  en: {
    errorType: '{{name}} is invalid' || function,
    errorType: {
      _default: '{{name}} is invalid' || function,
      fieldName: '{{name}} is invalid' || function,
    }
  },
});
```

`messages` does a deep extend on the existing messages.

For any of the ways you can set messages, the message can be either a string or a function that returns a string. If it's a string, it may contain handlebars placeholders for anything in the error object or anything passed in the `context` option of the `message` function. If it's a function, it will receive a single `context` argument that has all the same properties that are available as handlebars variables.

#### Example

```js
MessageBox.defaults({
  initialLanguage: 'en',
  messages: {
    en: {
      required: '{{label}} is required',
      minString: '{{label}} must be at least {{min}} characters',
      maxString: '{{label}} cannot exceed {{max}} characters',
      minNumber: '{{label}} must be at least {{min}}',
      maxNumber: '{{label}} cannot exceed {{max}}',
      minNumberExclusive: '{{label}} must be greater than {{min}}',
      maxNumberExclusive: '{{label}} must be less than {{max}}',
      minDate: '{{label}} must be on or after {{min}}',
      maxDate: '{{label}} cannot be after {{max}}',
      badDate: '{{label}} is not a valid date',
      minCount: 'You must specify at least {{minCount}} values',
      maxCount: 'You cannot specify more than {{maxCount}} values',
      noDecimal: '{{label}} must be an integer',
      notAllowed: '{{value}} is not an allowed value',
      expectedType: '{{label}} must be of type {{dataType}}',
      regEx: function ({
        label,
        type,
        regExp,
      }) {
        // See if there's one where exp matches this expression
        let msgObj;
        if (regExp) {
          msgObj = _.find(regExpMessages, (o) => o.exp && o.exp.toString() === regExp);
        }

        const regExpMessage = msgObj ? msgObj.msg : 'failed regular expression validation';

        return `${label} ${regExpMessage}`;
      },
      keyNotInSchema: '{{name}} is not allowed by the schema',
    },
  }
});
```

### Getting a Message

To get a message, you pass a single `ValidationError` error to the `message` function.

Here is a Meteor-specific example:

```js
Template.foo.events({
  'submit': (event, instance) => {
    Meteor.call('method', (err) => {
      if (ValidationError.is(err)) {
        err.details.forEach((fieldError) => {
          instance.state.set(`error-${fieldError.name}`: messageBox.message(fieldError));
        });
      }
    });
  }
});
```

See [https://github.com/meteor/validation-error] for details about the `ValidationError` type.

By default, this function returns the message for the current language as set with `initialLanguage` or `setLanguage`. However, you can instead specify a particular language:

```js
const message = messageBox.message(error, {
  language: 'pl',
});
```

#### Context

In the "Defining Messages" example, the placeholders like `label` and `min` must be in the error object or provided in the context option when calling `messages`:

```js
const message = messageBox.message(error, {
  context: {
    label: getSomeLabelFor(error.name),
  },
});
```

### Changing the Message Language

```js
messageBox.setLanguage('en');
```

### Reactivity in Meteor

If you use this in a Meteor app, you can make the messages reactive. Pass `Tracker` into the constructor:

```js
const messageBox = new MessageBox({
  messages: { ... },
  tracker: Tracker,
});
```

Then when you change the language, any call to `messageBox.message()` that does not specify a language and is in a reactive context will rerun.

### Template

By default (and historically) the substitution of strings is made using `{{}}`, you can change this by passing the `interpolate` and` escape` options:

```js
const messageBox = new MessageBox({
  messages: { ... },
  interpolate: /{{{([^\{\}#][\s\S]+?)}}}/g, // default
  escape: /{{([^\{\}#][\s\S]+?)}}/g; // default
});
```

It is also possible (but I would not recommend) to use logic within messages by using the `evaluate` option:

```js
var SUGGESTED_EVALUATE = require('MessageBox').SUGGESTED_EVALUATE
// or
import { SUGGESTED_EVALUATE } from 'MessageBox';

const messageBox = new MessageBox({
  messages: {
    en: {
      conditional: '{{# if (value) { }}true{{# } else { }}false{{# } }}',
    }
  },
  evaluate: SUGGESTED_EVALUATE,
});
```
