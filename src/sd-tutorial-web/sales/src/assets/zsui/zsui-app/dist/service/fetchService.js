(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./service.m.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./service.m.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.serviceM);
    global.fetchServiceM = mod.exports;
  }
})(this, function (_exports, _serviceM) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _serviceM = _interopRequireDefault(_serviceM);

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
   * Wraps a Fetch API to comply with {@link Service} protocol. Use it as a better alternative to {@link HTTPService} which is based on `XMLHTTPRequest`.
   * @exports FetchService 
   * @examples let userAPI = new FetchService({url: 'https://jsonplaceholder.typicode.com/users'});
    */
  var FetchService =
  /*#__PURE__*/
  function (_Service) {
    _inherits(FetchService, _Service);

    /**
     * @param {object} params - Request parameters
     */
    function FetchService(params) {
      var _this;

      _classCallCheck(this, FetchService);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FetchService).call(this));
      _this.params = params;
      return _this;
    }
    /**
     * Prepare an URL for the request. Helps to inject parameters like `{query: {userId:1}, path: {users: 1}}` in the URL to get something like `https://jsonplaceholder.typicode.com/users/1?userId=2`
     * @returns {string} - New URL string.
     */


    _createClass(FetchService, [{
      key: "applyParams",

      /**
       * How we apply parameters when we call a service multiple times
       * @param {object} newParams - New parameters
       */
      value: function applyParams(newParams) {
        var params = Object.assign(Object.create(newParams || {}), newParams);
        this.params = this.params || {}; // mix sections first

        if (params.query) {
          this.params.query = this.params.query || {};
          Object.assign(this.params.query, params.query);
          delete params.query;
        }

        if (params.path) {
          this.params.path = this.params.path || {};
          Object.assign(this.params.path, params.path);
          delete params.path;
        }

        if (params.headers) {
          this.params.headers = this.params.headers || {};
          Object.assign(this.params.headers, params.headers);
          delete params.headers;
        }

        if (params.body) {
          this.params.body = this.params.body || {};
          Object.assign(this.params.body, params.body);
          delete params.body;
        }

        Object.assign(this.params, params); // mix the rest of 
      }
      /**
       * Default response handler. Will handle errors and parse the data in a most typical way. Override this method to support complex cases.
       * @param {Response} response - Response of the request.
       * @returns {Promise} - Promise of a processed results.
       * @example userAPI.get({query:{_page: 2}}).then(userAPI.response) 
       */

    }, {
      key: "response",
      value: function response(_response) {
        if (_response.status >= 200 && _response.status < 300) {
          return _response.json() || _response.text();
        } else {
          var error = new Error(_response.statusText);
          error.response = _response;
          throw error;
        }
      }
      /**
       * Create an HTTP request in a compatible with the {@link Service} protocol way.
       * @param {object} params - Parameters of the request
       */

    }, {
      key: "request",
      value: function request(params) {
        this.applyParams(params);
        var prom = fetch(this.url, this.params);
        return prom;
      }
    }, {
      key: "url",
      get: function get() {
        var params = this.params;
        var url = new URL(params.url);

        if (params.path) {
          var pathname = url.pathname; // {items: 1} -- > /items/1 

          for (var i in params.path) {
            pathname += "/" + encodeURIComponent(i) + '/' + encodeURIComponent(params.path[i]);
          }

          url.pathname = pathname.replace('//', '/').replace('\\/', '/');
        }

        if (params.query) {
          // {itemId: 1} --> ?itemId = 1
          var search = url.searchParams;

          for (var _i in params.query) {
            search.append(_i, params.query[_i]);
          }

          url.search = search.toString();
        }

        return url.href;
      }
    }]);

    return FetchService;
  }(_serviceM.default);

  _exports.default = FetchService;
  ;
});
