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
    global.mixinM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.mix = mix;
  _exports.pipe = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /** 
   * Compose two or more objects. Respect property descriptors. 
   * @param {...object} Objects to compose.  target, source1, source2, ...
   * @return {object} Target object.
   * @example mix({a: 1}, {b: 2}); // {a:1, b:2}
  */
  function mix() {
    var args = arguments,
        target = args[0];

    if (target == undefined) {
      return;
    }

    if (args.length <= 1) {
      return target;
    }

    for (var i = 1; i < args.length; i++) {
      var obj = args[i];

      if (_typeof(obj) != 'object') {
        console.warn('Invalid parameter type "' + _typeof(obj) + '" for the argument #' + i);
        continue;
      } // Prohibited properties


      var descriptors = Object.getOwnPropertyDescriptors(obj);
      delete descriptors['constructor'];
      delete descriptors['__proto__'];
      Object.defineProperties(target, descriptors);
    }

    return target;
  } // Object.getOwnPropertyDescriptors polyfill for IE11


  if (!Object.hasOwnProperty('getOwnPropertyDescriptors')) {
    var supportsSymbol = Object.hasOwnProperty('getOwnPropertySymbols');
    Object.defineProperty(Object, 'getOwnPropertyDescriptors', {
      configurable: true,
      writable: true,
      value: function getOwnPropertyDescriptors(object) {
        var keys = Object.getOwnPropertyNames(object);

        if (supportsSymbol) {
          keys = keys.concat(Object.getOwnPropertySymbols(object));
        }

        return keys.reduce(function (descriptors, key) {
          return Object.defineProperty(descriptors, key, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: Object.getOwnPropertyDescriptor(object, key)
          });
        }, {});
      }
    });
  }
  /**
   * Functional piping 
   * @param  {...function} fns - One or more functions to use in composition
   * @return {function} - Pipe entry. Accepts a single argument.
   * @example uppercase = (string) => string.toUpperCase();
   * @example get6Characters = (string) => string.substring(0, 6);
   * @example pipe(uppercase, get6Characters)("My long string"); // MY LON
   */


  var pipe = function pipe() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    return function (x) {
      return fns.reduce(function (y, f) {
        return f(y);
      }, x);
    };
  };

  _exports.pipe = pipe;
});
//# sourceMappingURL=mixin.js.map
