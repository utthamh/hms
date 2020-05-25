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
    global.renderM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
   * Help to handle rendering of elements between creating and attaching to the DOM. You can set "shouldRender" property after creating an element.
   * @exports smartRender
   */
  var smartRender = {
    /**
     * Calculated properties
     * 
     * @private
     * @type {Object}
     */
    properties: {
      /**
      * Flag to trigger rendering of the element. Will render if the element is already attached to the DOM.
      * @memberof zs.smartRender
      * @type {boolean}
      */
      shouldRender: {
        get: function get() {
          return this._shouldRender;
        },
        set: function set(newValue) {
          if (newValue && this.isAttached) {
            if (typeof this.render == 'function') {
              this.render();
              this._shouldRender = false;
            }
          }

          this._shouldRender = newValue;
        }
      },

      /**
       * Flag to detect if an element is attached to the DOM or not. Will call render if shouldRender flag is set.
       * @memberof zs.smartRender
       * @type {boolean}
       */
      isAttached: {
        get: function get() {
          return this._isAttached;
        },
        set: function set(newValue) {
          if (newValue && this.shouldRender) {
            if (typeof this.render == 'function') {
              this.render();
              this._shouldRender = false;
            }
          }

          this._isAttached = newValue;
        }
      }
    },
    events: {
      attach: function attach() {
        this.isAttached = true;
      },
      detach: function detach() {
        this.isAttached = false;
      }
    }
  };
  var _default = smartRender;
  _exports.default = _default;
});
//# sourceMappingURL=render.js.map
