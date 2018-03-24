Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventOptionsKey = require('./eventOptionsKey');

var _eventOptionsKey2 = _interopRequireDefault(_eventOptionsKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ensureCanMutateNextEventHandlers(eventHandlers) {
  if (eventHandlers.handlers === eventHandlers.nextHandlers) {
    // eslint-disable-next-line no-param-reassign
    eventHandlers.nextHandlers = eventHandlers.handlers.slice();
  }
}

var TargetEventHandlers = function () {
  function TargetEventHandlers(target) {
    _classCallCheck(this, TargetEventHandlers);

    this.target = target;
    this.events = {};
  }

  _createClass(TargetEventHandlers, [{
    key: 'getEventHandlers',
    value: function () {
      function getEventHandlers(eventName, options) {
        var key = String(eventName) + ' ' + String((0, _eventOptionsKey2['default'])(options));

        if (!this.events[key]) {
          this.events[key] = {
            handlers: [],
            handleEvent: undefined
          };
          this.events[key].nextHandlers = this.events[key].handlers;
        }

        return this.events[key];
      }

      return getEventHandlers;
    }()
  }, {
    key: 'handleEvent',
    value: function () {
      function handleEvent(eventName, options, event) {
        var eventHandlers = this.getEventHandlers(eventName, options);
        eventHandlers.handlers = eventHandlers.nextHandlers;
        eventHandlers.handlers.forEach(function (handler) {
          if (handler) {
            // We need to check for presence here because a handler function may
            // cause later handlers to get removed. This can happen if you for
            // instance have a waypoint that unmounts another waypoint as part of an
            // onEnter/onLeave handler.
            handler(event);
          }
        });
      }

      return handleEvent;
    }()
  }, {
    key: 'add',
    value: function () {
      function add(eventName, listener, options) {
        var _this = this;

        // options has already been normalized at this point.
        var eventHandlers = this.getEventHandlers(eventName, options);

        ensureCanMutateNextEventHandlers(eventHandlers);

        if (eventHandlers.nextHandlers.length === 0) {
          eventHandlers.handleEvent = this.handleEvent.bind(this, eventName, options);

          this.target.addEventListener(eventName, eventHandlers.handleEvent, options);
        }

        eventHandlers.nextHandlers.push(listener);

        var isSubscribed = true;
        var unsubscribe = function () {
          function unsubscribe() {
            if (!isSubscribed) {
              return;
            }

            isSubscribed = false;

            ensureCanMutateNextEventHandlers(eventHandlers);
            var index = eventHandlers.nextHandlers.indexOf(listener);
            eventHandlers.nextHandlers.splice(index, 1);

            if (eventHandlers.nextHandlers.length === 0) {
              // All event handlers have been removed, so we want to remove the event
              // listener from the target node.

              if (_this.target) {
                // There can be a race condition where the target may no longer exist
                // when this function is called, e.g. when a React component is
                // unmounting. Guarding against this prevents the following error:
                //
                //   Cannot read property 'removeEventListener' of undefined
                _this.target.removeEventListener(eventName, eventHandlers.handleEvent, options);
              }

              eventHandlers.handleEvent = undefined;
            }
          }

          return unsubscribe;
        }();
        return unsubscribe;
      }

      return add;
    }()
  }]);

  return TargetEventHandlers;
}();

exports['default'] = TargetEventHandlers;