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
    global.configurationM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * Module to help with storing and updating settings for components or apps.
   * @module configuration 
   * @example import configuration from 'zsui/configuration/configuration.m.js'
   */
  var _default = {
    /**
     * Configure event normally fired via `configure` method
     * @event configure 
     * @property {object} config - Reference an updated configuration. Use it as `event.detail.config` in event handlers
     * @example window.addEventListener('configure', function(event) {console.log('config', event.detail.config);});
     * @example var event = new CustomEvent('configure', { detail: { config: {test:1} } }); window.dispatchEvent(event);  
     */

    /**
     * Store configuration as an object
     * @property
     * @example var someComponent.someProp = configuration.config.someProp;
     * @type {object}
     */
    config: null,

    /**
     * Configure a component
     * @example configuration.configure({test:1})
     * @param {...object=} - Use one or several configurations
     * @fires configure
     */
    configure: function configure() {
      if (!arguments.length) {
        return;
      }

      if (!this.config) {
        this.config = {};
      }

      for (var i = 0; i < arguments.length; i++) {
        if (_typeof(arguments[i]) != 'object') {
          continue;
        }

        Object.assign(this.config, arguments[i]);
      }

      var event = new CustomEvent('configure', {
        detail: {
          config: this.config
        }
      });

      if (typeof this.dispatchEvent == 'function') {
        this.dispatchEvent(event);
      } else {
        window.dispatchEvent(event);
      }
    }
  };
  _exports.default = _default;
});
