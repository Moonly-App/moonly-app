'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isempty');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isobject');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.without');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REMOVED_MARKER = '______MONGO_OBJECT_REMOVED______';

var MongoObject = function () {
  /*
   * @constructor
   * @param {Object} obj
   * @param {string[]}  blackboxKeys  - A list of the names of keys that shouldn't be traversed
   * @returns {undefined}
   *
   * Creates a new MongoObject instance. The object passed as the first argument
   * will be modified in place by calls to instance methods. Also, immediately
   * upon creation of the instance, the object will have any `undefined` keys
   * removed recursively.
   */

  function MongoObject(obj) {
    var blackboxKeys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    _classCallCheck(this, MongoObject);

    this._obj = obj;
    this._blackboxKeys = blackboxKeys;
    this._reParseObj();
  }

  _createClass(MongoObject, [{
    key: '_reParseObj',
    value: function _reParseObj() {
      var blackboxKeys = this._blackboxKeys;

      this._affectedKeys = {};
      this._genericAffectedKeys = {};
      this._parentPositions = [];
      this._positionsInsideArrays = [];
      this._objectPositions = [];
      this._arrayItemPositions = [];

      function parseObj(_this, val, currentPosition, affectedKey, operator, adjusted, isWithinArray) {
        // Adjust for first-level modifier operators
        if (!operator && affectedKey && affectedKey.substring(0, 1) === '$') {
          operator = affectedKey;
          affectedKey = null;
        }

        var affectedKeyIsBlackBox = false;
        var stop = false;
        if (affectedKey) {
          // Adjust for $push and $addToSet and $pull and $pop
          if (!adjusted) {
            if (operator === '$push' || operator === '$addToSet' || operator === '$pop') {
              // Adjust for $each
              // We can simply jump forward and pretend like the $each array
              // is the array for the field. This has the added benefit of
              // skipping past any $slice, which we also don't care about.
              if (MongoObject.isBasicObject(val) && '$each' in val) {
                val = val.$each;
                currentPosition = currentPosition + '[$each]';
              } else {
                affectedKey = affectedKey + '.0';
              }

              adjusted = true;
            } else if (operator === '$pull') {
              affectedKey = affectedKey + '.0';
              if (MongoObject.isBasicObject(val)) {
                stop = true;
              }

              adjusted = true;
            }
          }

          // Make generic key
          var affectedKeyGeneric = MongoObject.makeKeyGeneric(affectedKey);

          // Determine whether affected key should be treated as a black box
          affectedKeyIsBlackBox = blackboxKeys.indexOf(affectedKeyGeneric) > -1;

          // Mark that this position affects this generic and non-generic key
          if (currentPosition) {
            _this._affectedKeys[currentPosition] = affectedKey;
            _this._genericAffectedKeys[currentPosition] = affectedKeyGeneric;

            // If we're within an array, mark this position so we can omit it from flat docs
            if (isWithinArray) _this._positionsInsideArrays.push(currentPosition);
          }
        }

        if (stop) return;

        // Loop through arrays
        if (Array.isArray(val) && val.length > 0) {
          if (currentPosition) {
            // Mark positions with arrays that should be ignored when we want endpoints only
            _this._parentPositions.push(currentPosition);
          }

          // Loop
          (0, _lodash2.default)(val, function (v, i) {
            if (currentPosition) _this._arrayItemPositions.push(currentPosition + '[' + i + ']');
            parseObj(_this, v, currentPosition ? currentPosition + '[' + i + ']' : i, affectedKey + '.' + i, operator, adjusted, true);
          });
        } else if (MongoObject.isBasicObject(val) && !affectedKeyIsBlackBox || !currentPosition) {
          // Loop through object keys, only for basic objects,
          // but always for the passed-in object, even if it
          // is a custom object.

          if (currentPosition && !(0, _lodash4.default)(val)) {
            // Mark positions with objects that should be ignored when we want endpoints only
            _this._parentPositions.push(currentPosition);

            // Mark positions with objects that should be left out of flat docs.
            _this._objectPositions.push(currentPosition);
          }

          // Loop
          (0, _lodash2.default)(val, function (v, k) {
            if (v === void 0) {
              delete val[k];
            } else if (k !== '$slice') {
              parseObj(_this, v, currentPosition ? currentPosition + '[' + k + ']' : k, appendAffectedKey(affectedKey, k), operator, adjusted, isWithinArray);
            }
          });
        }
      }

      parseObj(this, this._obj);
    }

    /**
     * @method MongoObject.forEachNode
     * @param {Function} func
     * @param {Object} [options]
     * @param {Boolean} [options.endPointsOnly=true] - Only call function for endpoints and not for nodes that contain other nodes
     * @returns {undefined}
     *
     * Runs a function for each endpoint node in the object tree, including all items in every array.
     * The function arguments are
     * (1) the value at this node
     * (2) a string representing the node position
     * (3) the representation of what would be changed in mongo, using mongo dot notation
     * (4) the generic equivalent of argument 3, with '$' instead of numeric pieces
     */

  }, {
    key: 'forEachNode',
    value: function forEachNode(func) {
      var _this2 = this;

      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref$endPointsOnly = _ref.endPointsOnly;
      var endPointsOnly = _ref$endPointsOnly === undefined ? true : _ref$endPointsOnly;

      if (typeof func !== 'function') throw new Error('filter requires a loop function');

      var updatedValues = {};
      (0, _lodash2.default)(this._affectedKeys, function (affectedKey, position) {
        if (endPointsOnly && _this2._parentPositions.indexOf(position) > -1) return; // Only endpoints
        func.call({
          value: _this2.getValueForPosition(position),
          isArrayItem: _this2._arrayItemPositions.indexOf(position) > -1,
          operator: extractOp(position),
          position: position,
          key: affectedKey,
          genericKey: _this2._genericAffectedKeys[position],
          updateValue: function updateValue(newVal) {
            updatedValues[position] = newVal;
          },
          remove: function remove() {
            updatedValues[position] = undefined;
          }
        });
      });

      // Actually update/remove values as instructed
      (0, _lodash2.default)(updatedValues, function (newVal, position) {
        _this2.setValueForPosition(position, newVal);
      });
    }
  }, {
    key: 'getValueForPosition',
    value: function getValueForPosition(position) {
      var subkeys = position.split('[');
      var current = this._obj;
      var ln = subkeys.length;
      for (var i = 0; i < ln; i++) {
        var subkey = subkeys[i];

        // If the subkey ends in ']', remove the ending
        if (subkey.slice(-1) === ']') subkey = subkey.slice(0, -1);
        current = current[subkey];
        if (!Array.isArray(current) && !MongoObject.isBasicObject(current) && i < ln - 1) return;
      }

      if (current === REMOVED_MARKER) return;
      return current;
    }

    /**
     * @method MongoObject.prototype.setValueForPosition
     * @param {String} position
     * @param {Any} value
     * @returns {undefined}
     */

  }, {
    key: 'setValueForPosition',
    value: function setValueForPosition(position, value) {
      var subkeys = position.split('[');
      var current = this._obj;
      var ln = subkeys.length;

      for (var i = 0; i < ln; i++) {
        var subkey = subkeys[i];

        // If the subkey ends in "]", remove the ending
        if (subkey.slice(-1) === ']') subkey = subkey.slice(0, -1);

        // If we've reached the key in the object tree that needs setting or
        // deleting, do it.
        if (i === ln - 1) {
          // If value is undefined, delete the property
          if (value === undefined) {
            if (Array.isArray(current)) {
              // We can't just delete it because indexes in the position strings will be off
              // We will mark it uniquely and then parse this elsewhere
              current[subkey] = REMOVED_MARKER;
            } else {
              delete current[subkey];
            }
          } else {
            current[subkey] = value;
          }
        } else {
          // Otherwise attempt to keep moving deeper into the object.
          // If we're setting (as opposed to deleting) a key and we hit a place
          // in the ancestor chain where the keys are not yet created, create them.
          if (current[subkey] === undefined && value !== undefined) {
            // See if the next piece is a number
            var nextPiece = subkeys[i + 1];
            nextPiece = parseInt(nextPiece, 10);
            current[subkey] = isNaN(nextPiece) ? {} : [];
          }

          // Move deeper into the object
          current = current[subkey];

          // If we can go no further, then quit
          if (!Array.isArray(current) && !MongoObject.isBasicObject(current) && i < ln - 1) return;
        }
      }

      this._reParseObj();
    }

    /**
     * @method MongoObject.prototype.removeValueForPosition
     * @param {String} position
     * @returns {undefined}
     */

  }, {
    key: 'removeValueForPosition',
    value: function removeValueForPosition(position) {
      this.setValueForPosition(position, undefined);
    }

    /**
     * @method MongoObject.prototype.getKeyForPosition
     * @param {String} position
     * @returns {undefined}
     */

  }, {
    key: 'getKeyForPosition',
    value: function getKeyForPosition(position) {
      return this._affectedKeys[position];
    }

    /**
     * @method MongoObject.prototype.getGenericKeyForPosition
     * @param {String} position
     * @returns {undefined}
     */

  }, {
    key: 'getGenericKeyForPosition',
    value: function getGenericKeyForPosition(position) {
      return this._genericAffectedKeys[position];
    }

    /**
     * @method MongoObject.getInfoForKey
     * @param {String} key - Non-generic key
     * @returns {undefined|Object}
     *
     * Returns the value and operator of the requested non-generic key.
     * Example: {value: 1, operator: "$pull"}
     */

  }, {
    key: 'getInfoForKey',
    value: function getInfoForKey(key) {
      // Get the info
      var position = this.getPositionForKey(key);
      if (position) {
        return {
          value: this.getValueForPosition(position),
          operator: extractOp(position)
        };
      }

      // If we haven't returned yet, check to see if there is an array value
      // corresponding to this key
      // We find the first item within the array, strip the last piece off the
      // position string, and then return whatever is at that new position in
      // the original object.
      var positions = this.getPositionsForGenericKey(key + '.$');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = positions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var pos = _step.value;

          var value = this.getValueForPosition(pos);
          if (value === undefined) {
            var parentPosition = pos.slice(0, pos.lastIndexOf('['));
            value = this.getValueForPosition(parentPosition);
          }

          if (value !== undefined) {
            return {
              value: value,
              operator: extractOp(pos)
            };
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @method MongoObject.getPositionForKey
     * @param {String} key - Non-generic key
     * @returns {undefined|String} Position string
     *
     * Returns the position string for the place in the object that
     * affects the requested non-generic key.
     * Example: 'foo[bar][0]'
     */

  }, {
    key: 'getPositionForKey',
    value: function getPositionForKey(key) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.getOwnPropertyNames(this._affectedKeys)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var position = _step2.value;

          // We return the first one we find. While it's
          // possible that multiple update operators could
          // affect the same non-generic key, we'll assume that's not the case.
          if (this._affectedKeys[position] === key) return position;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * @method MongoObject.getPositionsForGenericKey
     * @param {String} key - Generic key
     * @returns {String[]} Array of position strings
     *
     * Returns an array of position strings for the places in the object that
     * affect the requested generic key.
     * Example: ['foo[bar][0]']
     */

  }, {
    key: 'getPositionsForGenericKey',
    value: function getPositionsForGenericKey(key) {
      var list = [];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.getOwnPropertyNames(this._genericAffectedKeys)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var position = _step3.value;

          if (this._genericAffectedKeys[position] === key) list.push(position);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return list;
    }

    /**
     * @method MongoObject.getPositionsInfoForGenericKey
     * @param {String} genericKey - Generic key
     * @returns {Object[]} Array of position info objects
     *
     * Returns an array of position info for the places in the object that
     * affect the requested generic key.
     * Example: ['foo[bar][0]']
     */

  }, {
    key: 'getPositionsInfoForGenericKey',
    value: function getPositionsInfoForGenericKey(genericKey) {
      var _this3 = this;

      var exactPositions = [];
      var arrayItemPositions = [];

      for (var position in this._genericAffectedKeys) {
        if (this._genericAffectedKeys.hasOwnProperty(position)) {
          var affectedKey = this._genericAffectedKeys[position];
          if (affectedKey === genericKey) {
            exactPositions.push(position);
          } else if (affectedKey === genericKey + '.$') {
            arrayItemPositions.push(position);
          }
        }
      }

      var list = exactPositions.length ? exactPositions : arrayItemPositions;

      return list.map(function (position) {
        var value = _this3.getValueForPosition(position);
        var key = MongoObject._positionToKey(position);
        var operator = extractOp(position);
        return {
          key: key,
          value: value,
          operator: operator,
          position: position
        };
      });
    }

    /**
     * @deprecated Use getInfoForKey
     * @method MongoObject.getValueForKey
     * @param {String} key - Non-generic key
     * @returns {undefined|Any}
     *
     * Returns the value of the requested non-generic key
     */

  }, {
    key: 'getValueForKey',
    value: function getValueForKey(key) {
      var position = this.getPositionForKey(key);
      if (position) return this.getValueForPosition(position);
    }

    /**
     * @method MongoObject.prototype.addKey
     * @param {String} key - Key to set
     * @param {Any} val - Value to give this key
     * @param {String} op - Operator under which to set it, or `null` for a non-modifier object
     * @returns {undefined}
     *
     * Adds `key` with value `val` under operator `op` to the source object.
     */

  }, {
    key: 'addKey',
    value: function addKey(key, val, op) {
      var position = op ? op + '[' + key + ']' : MongoObject._keyToPosition(key);
      this.setValueForPosition(position, val);
    }

    /**
     * @method MongoObject.prototype.removeGenericKeys
     * @param {String[]} keys
     * @returns {undefined}
     *
     * Removes anything that affects any of the generic keys in the list
     */

  }, {
    key: 'removeGenericKeys',
    value: function removeGenericKeys(keys) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = Object.getOwnPropertyNames(this._genericAffectedKeys)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var position = _step4.value;

          if (keys.indexOf(this._genericAffectedKeys[position]) > -1) {
            this.removeValueForPosition(position);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    /**
     * @method MongoObject.removeGenericKey
     * @param {String} key
     * @returns {undefined}
     *
     * Removes anything that affects the requested generic key
     */

  }, {
    key: 'removeGenericKey',
    value: function removeGenericKey(key) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.getOwnPropertyNames(this._genericAffectedKeys)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var position = _step5.value;

          if (this._genericAffectedKeys[position] === key) {
            this.removeValueForPosition(position);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }

    /**
     * @method MongoObject.removeKey
     * @param {String} key
     * @returns {undefined}
     *
     * Removes anything that affects the requested non-generic key
     */

  }, {
    key: 'removeKey',
    value: function removeKey(key) {
      // We don't use getPositionForKey here because we want to be sure to
      // remove for all positions if there are multiple.
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = Object.getOwnPropertyNames(this._affectedKeys)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var position = _step6.value;

          if (this._affectedKeys[position] === key) {
            this.removeValueForPosition(position);
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }

    /**
     * @method MongoObject.removeKeys
     * @param {String[]} keys
     * @returns {undefined}
     *
     * Removes anything that affects any of the non-generic keys in the list
     */

  }, {
    key: 'removeKeys',
    value: function removeKeys(keys) {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = keys[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var key = _step7.value;

          this.removeKey(key);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }

    /**
     * @method MongoObject.filterGenericKeys
     * @param {Function} test - Test function
     * @returns {undefined}
     *
     * Passes all affected keys to a test function, which
     * should return false to remove whatever is affecting that key
     */

  }, {
    key: 'filterGenericKeys',
    value: function filterGenericKeys(test) {
      var checkedKeys = [];
      var keysToRemove = [];
      for (var position in this._genericAffectedKeys) {
        if (this._genericAffectedKeys.hasOwnProperty(position)) {
          var genericKey = this._genericAffectedKeys[position];
          if (checkedKeys.indexOf(genericKey) === -1) {
            checkedKeys.push(genericKey);
            if (genericKey && !test(genericKey)) {
              keysToRemove.push(genericKey);
            }
          }
        }
      }

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = keysToRemove[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var key = _step8.value;

          this.removeGenericKey(key);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }

    /**
     * @method MongoObject.setValueForKey
     * @param {String} key
     * @param {Any} val
     * @returns {undefined}
     *
     * Sets the value for every place in the object that affects
     * the requested non-generic key
     */

  }, {
    key: 'setValueForKey',
    value: function setValueForKey(key, val) {
      // We don't use getPositionForKey here because we want to be sure to
      // set the value for all positions if there are multiple.
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = Object.getOwnPropertyNames(this._affectedKeys)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var position = _step9.value;

          if (this._affectedKeys[position] === key) {
            this.setValueForPosition(position, val);
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }

    /**
     * @method MongoObject.setValueForGenericKey
     * @param {String} key
     * @param {Any} val
     * @returns {undefined}
     *
     * Sets the value for every place in the object that affects
     * the requested generic key
     */

  }, {
    key: 'setValueForGenericKey',
    value: function setValueForGenericKey(key, val) {
      // We don't use getPositionForKey here because we want to be sure to
      // set the value for all positions if there are multiple.
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = Object.getOwnPropertyNames(this._genericAffectedKeys)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var position = _step10.value;

          if (this._genericAffectedKeys[position] === key) {
            this.setValueForPosition(position, val);
          }
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    }
  }, {
    key: 'removeArrayItems',
    value: function removeArrayItems() {
      // Traverse and pull out removed array items at this point
      function traverse(obj) {
        (0, _lodash2.default)(obj, function (val, indexOrProp) {
          // Move deeper into the object
          var next = obj[indexOrProp];

          // If we can go no further, then quit
          if (MongoObject.isBasicObject(next)) {
            traverse(next);
          } else if (Array.isArray(next)) {
            obj[indexOrProp] = (0, _lodash8.default)(next, REMOVED_MARKER);
            traverse(obj[indexOrProp]);
          }
        });
      }

      traverse(this._obj);
    }

    /**
     * @method MongoObject.getObject
     * @returns {Object}
     *
     * Get the source object, potentially modified by other method calls on this
     * MongoObject instance.
     */

  }, {
    key: 'getObject',
    value: function getObject() {
      return this._obj;
    }

    /**
     * @method MongoObject.getFlatObject
     * @returns {Object}
     *
     * Gets a flat object based on the MongoObject instance.
     * In a flat object, the key is the name of the non-generic affectedKey,
     * with mongo dot notation if necessary, and the value is the value for
     * that key.
     *
     * With `keepArrays: true`, we don't flatten within arrays. Currently
     * MongoDB does not see a key such as `a.0.b` and automatically assume
     * an array. Instead it would create an object with key '0' if there
     * wasn't already an array saved as the value of `a`, which is rarely
     * if ever what we actually want. To avoid this confusion, we
     * set entire arrays.
     */

  }, {
    key: 'getFlatObject',
    value: function getFlatObject() {
      var _this4 = this;

      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$keepArrays = _ref2.keepArrays;
      var keepArrays = _ref2$keepArrays === undefined ? false : _ref2$keepArrays;

      var newObj = {};
      (0, _lodash2.default)(this._affectedKeys, function (affectedKey, position) {
        if (typeof affectedKey === 'string' && keepArrays === true && _this4._positionsInsideArrays.indexOf(position) === -1 && _this4._objectPositions.indexOf(position) === -1 || keepArrays !== true && _this4._parentPositions.indexOf(position) === -1) {
          newObj[affectedKey] = _this4.getValueForPosition(position);
        }
      });
      return newObj;
    }

    /**
     * @method MongoObject.affectsKey
     * @param {String} key
     * @returns {Object}
     *
     * Returns true if the non-generic key is affected by this object
     */

  }, {
    key: 'affectsKey',
    value: function affectsKey(key) {
      return !!this.getPositionForKey(key);
    }

    /**
     * @method MongoObject.affectsGenericKey
     * @param {String} key
     * @returns {Object}
     *
     * Returns true if the generic key is affected by this object
     */

  }, {
    key: 'affectsGenericKey',
    value: function affectsGenericKey(key) {
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = Object.getOwnPropertyNames(this._genericAffectedKeys)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var position = _step11.value;

          if (this._genericAffectedKeys[position] === key) return true;
        }
      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && _iterator11.return) {
            _iterator11.return();
          }
        } finally {
          if (_didIteratorError11) {
            throw _iteratorError11;
          }
        }
      }

      return false;
    }

    /**
     * @method MongoObject.affectsGenericKeyImplicit
     * @param {String} key
     * @returns {Object}
     *
     * Like affectsGenericKey, but will return true if a child key is affected
     */

  }, {
    key: 'affectsGenericKeyImplicit',
    value: function affectsGenericKeyImplicit(key) {
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = Object.getOwnPropertyNames(this._genericAffectedKeys)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var position = _step12.value;

          var affectedKey = this._genericAffectedKeys[position];
          if (genericKeyAffectsOtherGenericKey(key, affectedKey)) return true;
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      return false;
    }

    /* STATIC */

    /* Takes a specific string that uses mongo-style dot notation
     * and returns a generic string equivalent. Replaces all numeric
     * "pieces" with a dollar sign ($).
     *
     * @param {type} name
     * @returns {String} Generic name.
     */

  }], [{
    key: 'makeKeyGeneric',
    value: function makeKeyGeneric(key) {
      if (typeof key !== 'string') return null;
      return key.replace(/\.[0-9]+(?=\.|$)/g, '.$');
    }

    /** Takes a string representation of an object key and its value
     *  and updates "obj" to contain that key with that value.
     *
     *  Example keys and results if val is 1:
     *    "a" -> {a: 1}
     *    "a[b]" -> {a: {b: 1}}
     *    "a[b][0]" -> {a: {b: [1]}}
     *    'a[b.0.c]' -> {a: {'b.0.c': 1}}
     *
     * @param {any} val
     * @param {String} key
     * @param {Object} obj
     * @returns {undefined}
     */

  }, {
    key: 'expandKey',
    value: function expandKey(val, key, obj) {
      var subkeys = key.split('[');
      var current = obj;
      for (var i = 0, ln = subkeys.length; i < ln; i++) {
        var subkey = subkeys[i];
        if (subkey.slice(-1) === ']') {
          subkey = subkey.slice(0, -1);
        }

        if (i === ln - 1) {
          // Last iteration; time to set the value; always overwrite
          current[subkey] = val;

          // If val is undefined, delete the property
          if (val === void 0) delete current[subkey];
        } else {
          // See if the next piece is a number
          var nextPiece = subkeys[i + 1];
          nextPiece = parseInt(nextPiece, 10);
          if (!current[subkey]) {
            current[subkey] = isNaN(nextPiece) ? {} : [];
          }
        }

        current = current[subkey];
      }
    }
  }, {
    key: '_keyToPosition',
    value: function _keyToPosition(key, wrapAll) {
      var position = '';
      (0, _lodash2.default)(key.split('.'), function (piece, i) {
        if (i === 0 && !wrapAll) {
          position += piece;
        } else {
          position += '[' + piece + ']';
        }
      });
      return position;
    }

    /**
     * @method MongoObject._positionToKey
     * @param {String} position
     * @returns {String} The key that this position in an object would affect.
     *
     * This is different from MongoObject.prototype.getKeyForPosition in that
     * this method does not depend on the requested position actually being
     * present in any particular MongoObject.
     */

  }, {
    key: '_positionToKey',
    value: function _positionToKey(position) {
      // XXX Probably a better way to do this, but this is
      // foolproof for now.
      var mDoc = new MongoObject({});
      mDoc.setValueForPosition(position, 1); // Value doesn't matter
      return mDoc.getKeyForPosition(position);
    }

    /**
     * @method MongoObject.cleanNulls
     * @public
     * @param {Object} doc - Source object
     * @returns {Object}
     *
     * Returns an object in which all properties with null, undefined, or empty
     * string values have been removed, recursively.
     */

  }, {
    key: 'cleanNulls',
    value: function cleanNulls(doc, isArray, keepEmptyStrings) {
      var newDoc = isArray ? [] : {};
      (0, _lodash2.default)(doc, function (val, key) {
        if (!Array.isArray(val) && MongoObject.isBasicObject(val)) {
          val = MongoObject.cleanNulls(val, false, keepEmptyStrings); // Recurse into plain objects
          if (!(0, _lodash4.default)(val)) newDoc[key] = val;
        } else if (Array.isArray(val)) {
          val = MongoObject.cleanNulls(val, true, keepEmptyStrings); // Recurse into non-typed arrays
          if (!(0, _lodash4.default)(val)) newDoc[key] = val;
        } else if (!isNullUndefinedOrEmptyString(val)) {
          newDoc[key] = val;
        } else if (keepEmptyStrings && typeof val === 'string' && val.length === 0) {
          newDoc[key] = val;
        }
      });
      return newDoc;
    }

    /**
     * @method MongoObject.reportNulls
     * @public
     * @param {Object} flatDoc - An object with no properties that are also objects.
     * @returns {Object} An object in which the keys represent the keys in the
     * original object that were null, undefined, or empty strings, and the value
     * of each key is "".
     */

  }, {
    key: 'reportNulls',
    value: function reportNulls(flatDoc, keepEmptyStrings) {
      var nulls = {};

      // Loop through the flat doc
      (0, _lodash2.default)(flatDoc, function (val, key) {
        if (val === null || val === undefined || !keepEmptyStrings && typeof val === 'string' && val.length === 0 ||

        // If value is an array in which all the values recursively are undefined, null,
        // or an empty string
        Array.isArray(val) && MongoObject.cleanNulls(val, true, keepEmptyStrings).length === 0) {
          nulls[key] = '';
        }
      });
      return nulls;
    }

    /**
     * @method MongoObject.docToModifier
     * @public
     * @param {Object} doc - An object to be converted into a MongoDB modifier
     * @param {Object} [options] - Options
     * @param {Boolean} [options.keepEmptyStrings] - Pass `true` to keep empty strings in the $set. Otherwise $unset them.
     * @param {Boolean} [options.keepArrays] - Pass `true` to $set entire arrays. Otherwise the modifier will $set individual array items.
     * @returns {Object} A MongoDB modifier.
     *
     * Converts an object into a modifier by flattening it, putting keys with
     * null, undefined, and empty string values into `modifier.$unset`, and
     * putting the rest of the keys into `modifier.$set`.
     */

  }, {
    key: 'docToModifier',
    value: function docToModifier(doc) {
      var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref3$keepArrays = _ref3.keepArrays;
      var keepArrays = _ref3$keepArrays === undefined ? false : _ref3$keepArrays;
      var _ref3$keepEmptyString = _ref3.keepEmptyStrings;
      var keepEmptyStrings = _ref3$keepEmptyString === undefined ? false : _ref3$keepEmptyString;

      // Flatten doc
      var mDoc = new MongoObject(doc);
      var flatDoc = mDoc.getFlatObject({ keepArrays: keepArrays });

      // Get a list of null, undefined, and empty string values so we can unset them instead
      var nulls = MongoObject.reportNulls(flatDoc, keepEmptyStrings);
      flatDoc = MongoObject.cleanNulls(flatDoc, false, keepEmptyStrings);

      var modifier = {};
      if (!(0, _lodash4.default)(flatDoc)) modifier.$set = flatDoc;
      if (!(0, _lodash4.default)(nulls)) modifier.$unset = nulls;
      return modifier;
    }

    /* Tests whether "obj" is an Object as opposed to
     * something that inherits from Object
     *
     * @param {any} obj
     * @returns {Boolean}
     */

  }, {
    key: 'isBasicObject',
    value: function isBasicObject(obj) {
      return obj === Object(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    }

    /**
     * @method MongoObject.objAffectsKey
     * @public
     * @param  {Object} obj
     * @param  {String} key
     * @return {Boolean}
     */

  }, {
    key: 'objAffectsKey',
    value: function objAffectsKey(obj, key) {
      var mDoc = new MongoObject(obj);
      return mDoc.affectsKey(key);
    }

    /**
     * @method MongoObject.expandObj
     * @public
     * @param  {Object} doc
     * @return {Object}
     *
     * Takes a flat object and returns an expanded version of it.
     */

  }, {
    key: 'expandObj',
    value: function expandObj(doc) {
      var newDoc = {};
      (0, _lodash2.default)(doc, function (val, key) {
        var subkeys = key.split('.');
        var subkeylen = subkeys.length;
        var current = newDoc;
        for (var i = 0; i < subkeylen; i++) {
          var subkey = subkeys[i];
          if (typeof current[subkey] !== 'undefined' && !(0, _lodash6.default)(current[subkey])) {
            break; // Already set for some reason; leave it alone
          }

          if (i === subkeylen - 1) {
            // Last iteration; time to set the value
            current[subkey] = val;
          } else {
            // See if the next piece is a number
            var nextPiece = subkeys[i + 1];
            nextPiece = parseInt(nextPiece, 10);
            if (isNaN(nextPiece) && !(0, _lodash6.default)(current[subkey])) {
              current[subkey] = {};
            } else if (!isNaN(nextPiece) && !Array.isArray(current[subkey])) {
              current[subkey] = [];
            }
          }

          current = current[subkey];
        }
      });
      return newDoc;
    }
  }]);

  return MongoObject;
}();

/* PRIVATE */

exports.default = MongoObject;
function appendAffectedKey(affectedKey, key) {
  if (key === '$each') return affectedKey;
  return affectedKey ? affectedKey + '.' + key : key;
}

// Extracts operator piece, if present, from position string
function extractOp(position) {
  var firstPositionPiece = position.slice(0, position.indexOf('['));
  return firstPositionPiece.substring(0, 1) === '$' ? firstPositionPiece : null;
}

function genericKeyAffectsOtherGenericKey(key, affectedKey) {
  // If the affected key is the test key
  if (affectedKey === key) return true;

  // If the affected key implies the test key because the affected key
  // starts with the test key followed by a period
  if (affectedKey.substring(0, key.length + 1) === key + '.') return true;

  // If the affected key implies the test key because the affected key
  // starts with the test key and the test key ends with ".$"
  var lastTwo = key.slice(-2);
  if (lastTwo === '.$' && key.slice(0, -2) === affectedKey) return true;

  return false;
}

function isNullUndefinedOrEmptyString(val) {
  return val === undefined || val === null || typeof val === 'string' && val.length === 0;
}