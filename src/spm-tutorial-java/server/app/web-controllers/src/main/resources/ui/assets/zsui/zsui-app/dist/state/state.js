(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.stateM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.State = _exports.StateManager = void 0;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

  function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

  function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  /**
   * Class to create and store states of components or apps based on {@link https://developer.mozilla.org/en-US/docs/Web/API/|URLSearchParams}
   * @exports State
   * @extends URLSearchParams
   * @example var myState = new State({test:1});
   */
  var State =
  /*#__PURE__*/
  function (_URLSearchParams) {
    _inherits(State, _URLSearchParams);

    /**
     * Create a state object
     * @param {USVString=} init - A USVString instance, a URLSearchParams instance, a sequence of USVStrings, or a record containing USVStrings. Note that using a URLSearchParams instance is deprecated; soon browsers will just use a USVString for the init.
     * @example var state = new State('param1=1&param2=2'); var state2 = new State({param1:1,param2:2});
     */
    function State(init) {
      var _this;

      _classCallCheck(this, State);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(State).call(this, init));

      if (typeof _this.diff != 'function') {
        // Work around for weird Safari bug
        Object.assign(_assertThisInitialized(_this), stateExtension);
      }

      return _this;
    }

    return State;
  }(_wrapNativeSuper(URLSearchParams));

  _exports.State = State;
  var stateExtension = {
    /**
     * Difference from another State instance
     * @param {State} newStateObject - Another State instance to compare with
     * @return {Object} - Detected changes presented as an object like `{editedKeys: [], deletedKeys: [], newKeys: [], changedKeys: []}`
     * @example var myState = new State({test:1}); myState.diff(new State({test:2})); // {"editedKeys":["test"],"deletedKeys":[],"newKeys":[],"changedKeys":["test"]}
     */
    diff: function diff(newStateObject) {
      var keys = Object.assign(this.toPlainObject(), newStateObject.toPlainObject()),
          // Combined set of keys			
      results = {
        editedKeys: [],
        deletedKeys: [],
        newKeys: [],
        changedKeys: []
      },
          self = this;

      for (var i in keys) {
        if (newStateObject.get(i) == null) {
          results.deletedKeys.push(i);
          results.changedKeys.push(i);
        } else if (self.get(i) == null) {
          results.newKeys.push(i);
          results.changedKeys.push(i);
        } else if (self.get(i) !== newStateObject.get(i)) {
          results.editedKeys.push(i);
          results.changedKeys.push(i);
        }
      }

      ;
      return results;
    },

    /**
     * Checks if the state objects is identical to another one
     * @param {State} toAnotherState - Another state object to compare with
     */
    isEqual: function isEqual(toAnotherState) {
      // Check size first
      if (this.toString().length != toAnotherState.toString().length) {
        return false;
      }

      var diff = this.diff(toAnotherState);
      return diff.changedKeys.length == 0;
    },

    /**
     * Converts the state object to JSON object
     * @returns {object} - Plain JSON object 
     */
    toPlainObject: function toPlainObject() {
      var obj = {};
      this.forEach(function (value, key) {
        obj[key] = value;
      });
      return obj;
    },

    /**
     * Update the state with a plain JSON object
     * @param {object} stringOrJsonOrState 
     */
    update: function update(stringOrJsonOrState) {
      var changes = new State(stringOrJsonOrState);
      var changesObj = changes.toPlainObject();

      for (var i in changesObj) {
        var key = i;
        var value = changesObj[i];
        this.set(key, value);
      }

      ;
    }
  };
  Object.assign(State.prototype, stateExtension);
  /**
   * @exports StateManager
   * @example var stateManager = new StateManager(window.location.href);
   */

  var StateManager =
  /*#__PURE__*/
  function () {
    /**
     * @param {object|State|URLSearchParams|string} urlStringOrStateObject - We can initialize our state manager with a State object or a string.
     */
    function StateManager(urlStringOrStateObject) {
      _classCallCheck(this, StateManager);

      window.addEventListener("hashchange", this);
      window.addEventListener("popstate", this);

      if (typeof urlStringOrStateObject == 'string') {
        this.url = new URL(urlStringOrStateObject);
      } else if (urlStringOrStateObject instanceof URLSearchParams) {
        this.state = new State(urlStringOrStateObject.toString());
      } else if (urlStringOrStateObject instanceof Object) {
        this.state = new State(urlStringOrStateObject);
      }
    }

    _createClass(StateManager, [{
      key: "handleEvent",
      value: function handleEvent(event) {
        if (event.type == 'popstate' && event.state) {
          this.state = new State(event.state);
          return;
        }

        this.url = new URL(window.location.href);
      }
      /**
       * Store current URL object 
       * @type {object}
       */

    }, {
      key: "update",

      /**
       * Update our state with a plain JSON object
       * @param {object} stringOrJsonOrState 
       */
      value: function update(stringOrJsonOrState) {
        var newState = new State(this.state);
        newState.update(stringOrJsonOrState);
        this.state = newState;
      }
      /**
       * Default way to reflect State in URL
       * @param {State} newStateObject 
       */

    }, {
      key: "stateToUrl",
      value: function stateToUrl(newStateObject) {
        var url = new URL(this._url ? this._url.href : window.location.href);
        var newState = new State(newStateObject.toString()); // clone

        if (newState.get('hash') != null) {
          url.hash = newState.get('hash');
          newState.delete('hash');
        }

        if (newState.get('pathname') != null) {
          url.pathname = newState.get('pathname');
          newState.delete('pathname');
        }

        url.search = '?' + newState.toString().replace(/\+/ig, "%20"); // See: https://stackoverflow.com/questions/1211229/in-a-url-should-spaces-be-encoded-using-20-or

        return url;
      }
      /**
       * Default way to reflect URL in State
       * @param {URL} url - URL object
       */

    }, {
      key: "urlToState",
      value: function urlToState(url) {
        var state = new State(url.searchParams, function () {});
        state.append('hash', url.hash);
        state.append('pathname', url.pathname);
        return state;
      }
      /**
       * Handle change of state
       * @param {object} newObject - Object with changes in the state to apply
       * @param {dontPush} boolean - Skip pushing the state and change the URL. You might need this initially.
       * @fires statechange
       */

    }, {
      key: "onstatechange",
      value: function onstatechange(dontPush) {
        var newState = this.state,
            diff,
            prevState; // Detect changes

        if (this._prevStateString) {
          prevState = new State(this._prevStateString);
        } else {
          prevState = new State();
        }

        diff = prevState.diff(newState);

        if (!dontPush) {
          history.pushState(newState.toPlainObject(), document ? document.head.title : '', this.url.href);
        }

        var event = new CustomEvent('statechange', {
          detail: {
            newState: newState,
            diff: diff,
            stateManager: this
          }
        });
        window.dispatchEvent(event);
      }
      /**
       * Remove all event listeners
       */

    }, {
      key: "cleanUp",
      value: function cleanUp() {
        window.removeEventListener('hashchange', this);
        window.removeEventListener('popstate', this);
      }
    }, {
      key: "url",
      set: function set(newURLObject) {
        if (!this._url || this._url.href != newURLObject.href) {
          // Sync state
          var firstTime = this._url === undefined;
          this._url = newURLObject; // Should go before state update to avoid endless loop

          this.state = this.urlToState(newURLObject);
          this.onstatechange(firstTime);
        }
      },
      get: function get() {
        return this._url;
      }
      /** 
       * State 
       * @type {State} 		 
       */

    }, {
      key: "state",
      set: function set(newObject) {
        if (this._state === undefined || !this._state.isEqual(newObject)) {
          if (this._state) {
            this._prevStateString = this._state.toString();
          }

          this._state = newObject; // Sync URL

          var newUrl = this.stateToUrl(newObject);

          if (this._url === undefined || newUrl.href != this._url.href) {
            this.url = newUrl;
          }
        }
      },
      get: function get() {
        return this._state;
      }
    }]);

    return StateManager;
  }();

  _exports.StateManager = StateManager;
  ;
});
