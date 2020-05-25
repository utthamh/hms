(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.demoCompositionM = mod.exports;
  }
})(this, function () {
  "use strict";

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

  function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

  function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // Display big numbers
  var BigNumberCls =
  /*#__PURE__*/
  function () {
    function BigNumberCls() {
      _classCallCheck(this, BigNumberCls);
    }

    _createClass(BigNumberCls, [{
      key: "valueOf",
      value: function valueOf() {
        return this._value;
      }
    }, {
      key: "toString",
      value: function toString(value) {
        value = value || this.value;

        if (value >= 1000) {
          var suffixes = this.suffixes;
          var suffixNum = Math.floor(("" + value).length / 3);
          var shortValue = '';

          for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');

            if (dotLessShortValue.length <= 2) {
              break;
            }
          }

          if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
          return shortValue + suffixes[suffixNum];
        }

        return value.toString();
      }
    }, {
      key: "value",
      get: function get() {
        return this._value || 0;
      },
      set: function set(newValue) {
        this._value = newValue;
      }
    }, {
      key: "suffixes",
      get: function get() {
        return ["", "k", "m", "b", "t"];
      }
    }]);

    return BigNumberCls;
  }(); // Incremental button


  var IncrementalButton =
  /*#__PURE__*/
  function (_HTMLButtonElement) {
    _inherits(IncrementalButton, _HTMLButtonElement);

    function IncrementalButton() {
      _classCallCheck(this, IncrementalButton);

      return _possibleConstructorReturn(this, _getPrototypeOf(IncrementalButton).call(this));
    }

    _createClass(IncrementalButton, [{
      key: "increment",
      value: function increment(amount) {
        this.value = (Number(this.value) || 0) + amount;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.addEventListener('click', function (event) {
          this.increment(1000);
          this.innerHTML = this.toString ? this.toString(this.value) : this.value;
        });
      }
    }]);

    return IncrementalButton;
  }(_wrapNativeSuper(HTMLButtonElement)); // Apply composition


  mix(IncrementalButton.prototype, BigNumberCls.prototype); // Define custom Element

  customElements.define('inc-button', IncrementalButton, {
    extends: 'button'
  }); // Create a button and append it to the DOM

  var incBtn = document.createElement('button', {
    is: 'inc-button'
  });
  incBtn.innerHTML = 'Click me';
  incBtn.classList.add('zs-button');
  document.body.appendChild(incBtn); // Functional mixin of a BigNumber class

  function BigNumberClsMixin(Base) {
    return (
      /*#__PURE__*/
      function (_Base) {
        _inherits(BigNumberCls, _Base);

        function BigNumberCls() {
          _classCallCheck(this, BigNumberCls);

          return _possibleConstructorReturn(this, _getPrototypeOf(BigNumberCls).apply(this, arguments));
        }

        _createClass(BigNumberCls, [{
          key: "valueOf",
          value: function valueOf() {
            return this._value;
          }
        }, {
          key: "toString",
          value: function toString(value) {
            value = value || this.value;

            if (value >= 1000) {
              var suffixes = this.suffixes;
              var suffixNum = Math.floor(("" + value).length / 3);
              var shortValue = '';

              for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat((suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');

                if (dotLessShortValue.length <= 2) {
                  break;
                }
              }

              if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
              return shortValue + suffixes[suffixNum];
            }

            return value.toString();
          }
        }, {
          key: "value",
          get: function get() {
            return this._value || 0;
          },
          set: function set(newValue) {
            this._value = newValue;
          }
        }, {
          key: "suffixes",
          get: function get() {
            return ["", "k", "m", "b", "t"];
          }
        }]);

        return BigNumberCls;
      }(Base)
    );
  } // Define another custom button but with using functional composition


  customElements.define('inc-mix-button', BigNumberClsMixin(IncrementalButton), {
    extends: 'button'
  }); // Create a button and append it to the DOM

  var incMixBtn = document.createElement('button', {
    is: 'inc-mix-button'
  });
  incMixBtn.innerHTML = 'Click me';
  incMixBtn.classList.add('zs-button');
  document.body.appendChild(incMixBtn);
});
//# sourceMappingURL=demoComposition.js.map
