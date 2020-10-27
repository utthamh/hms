(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./store.m.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./store.m.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.storeM);
    global.localStoreM = mod.exports;
  }
})(this, function (_exports, _storeM) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _storeM = _interopRequireDefault(_storeM);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * Store data in localStorage.
   * @exports LocalStore
   * @example var store = new LocalStore();
   */
  var LocalStore =
  /*#__PURE__*/
  function (_Store) {
    _inherits(LocalStore, _Store);

    function LocalStore() {
      _classCallCheck(this, LocalStore);

      return _possibleConstructorReturn(this, _getPrototypeOf(LocalStore).apply(this, arguments));
    }

    _createClass(LocalStore, [{
      key: "getItem",

      /**
       * Load an item from the store
       * @param {string} key - Item key
       * @param {=boolean} checkExpiration - Optionally check if item is expired
       * @returns {object} - Item value. Null when not found. Null when expired.
       * @example myStore.getItem('test');
       */
      value: function getItem(key, checkExpiration) {
        if (!this.isReady) {
          throw 'Storage not available';
        }

        var value = window.localStorage.getItem(key);
        value = this.decrypt(value);

        if (checkExpiration && this.isExpired(key)) {
          if (typeof checkExpiration == 'function') {
            checkExpiration(value);
            return value;
          } else {
            this.deleteExpiration(key);
            this.removeItem(key);
            return null;
          }
        } else {
          return value;
        }
      }
      /**
       * Default encryption method. Used before we save an item to the store.
       * @param {object} value 
       * @returns {object} - Encrypted value
       */

    }, {
      key: "encrypt",
      value: function encrypt(value) {
        if (_typeof(value) == 'object') {
          try {
            return JSON.stringify(value);
          } catch (e) {
            throw 'Invalid value to store ' + value;
          }
        }

        return value + "";
      }
      /**
       * Default decryption method. Used after we load an item from the store.
       * @param {object} value - Encrypted value 
       * @return {object} - Decrypted value
       */

    }, {
      key: "decrypt",
      value: function decrypt(value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      /**
       * Save an item to the store
       * @param {string} key - Item key
       * @param {object} value - Item value
       * @param {=number} expireInSeconds - How many seconds to store item
       * @example myStore.setItem('test', 1);
       */

    }, {
      key: "setItem",
      value: function setItem(key, value, expireInSeconds) {
        if (!this.isReady) {
          throw 'Storage not available';
        }

        window.localStorage.setItem(key, this.encrypt(value));

        if (expireInSeconds > 0) {
          this.setExpiration(key, expireInSeconds);
        } else {
          this.deleteExpiration(key);
        }
      }
      /**
       * Remove item from the store
       * @param {string} key - Item key
       * @example myStore.removeItem('test');
       */

    }, {
      key: "removeItem",
      value: function removeItem(key) {
        if (!this.isReady) {
          throw 'Storage not available';
        }

        window.localStorage.removeItem(key);
      }
      /**
       * Check if storage is available
       */

    }, {
      key: "isReady",
      get: function get() {
        return window.localStorage;
      }
    }]);

    return LocalStore;
  }(_storeM.default);

  _exports.default = LocalStore;
});
