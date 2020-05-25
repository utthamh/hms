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
    global.storeM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _storage = {}; // Use memory by default

  /**
   * Store data in memory in a hash table key -> value form.
   * @exports Store
   * @example var store = new Store(); 
   */

  var Store =
  /*#__PURE__*/
  function () {
    function Store() {
      _classCallCheck(this, Store);
    }

    _createClass(Store, [{
      key: "getItem",

      /**
       * Load an item from the store
       * @param {string} key - Item key
       * @param {=boolean} checkExpiration - Optionally check if item is expired
       * @returns {object} - Item value. Undefined when not found. Null when expired.
       * @example myStore.getItem('test');
       */
      value: function getItem(key, checkExpiration) {
        if (!this.isReady) {
          throw 'Storage not available';
        }

        var value = _storage[key];

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

        _storage[key] = value;

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

        delete _storage[key];
      }
      /**
       * Generate a special key to store an expiration date
       * @param {string} forItemByKey - Key of the item
       */

    }, {
      key: "expireKey",
      value: function expireKey(forItemByKey) {
        return 'expiration-date-for-' + forItemByKey;
      }
      /**
       * Store expiration data for an item
       * @param {string} forItemByKey - Key of the item
       * @param {number} inSeconds - In how many seconds item expires?
       */

    }, {
      key: "setExpiration",
      value: function setExpiration(forItemByKey, inSeconds) {
        var expireOn = new Date();
        expireOn = new Date().valueOf() + inSeconds * 1000; // ms

        this.setItem(this.expireKey(forItemByKey), expireOn);
      }
      /**
       * Remove a special entry with expiration date from the store
       * @param {string} forItemByKey - Key of the item
       */

    }, {
      key: "deleteExpiration",
      value: function deleteExpiration(forItemByKey) {
        this.removeItem(this.expireKey(forItemByKey));
      }
      /**
       * Check if item has expired
       * @param {string} key - Item key
       */

    }, {
      key: "isExpired",
      value: function isExpired(key) {
        var now = new Date().valueOf();
        var expireOn = this.getItem(this.expireKey(key));

        if (!expireOn) {
          return false;
        }

        if (now > expireOn) {
          return true;
        }

        return false;
      }
      /**
       * Check if storage is ready
       */

    }, {
      key: "isReady",
      get: function get() {
        return true;
      }
    }]);

    return Store;
  }();

  _exports.default = Store;
});
