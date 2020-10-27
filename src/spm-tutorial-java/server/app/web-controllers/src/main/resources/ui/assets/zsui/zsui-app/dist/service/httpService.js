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
    global.httpServiceM = mod.exports;
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

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  // URLSearchParams, URL

  /**
   * Creates a wrapper around `XMLHTTPRequest` and complies with {@link Service} protocol
   * @exports HTTPService
   * @param {object} params - Request parameters
   * @example var userAPI = new HTTPService({url: 'https://jsonplaceholder.typicode.com/users'});
   */
  var HTTPService =
  /*#__PURE__*/
  function (_Service) {
    _inherits(HTTPService, _Service);

    _createClass(HTTPService, [{
      key: "xhr",

      /**
       * Creates and returns an `XMLHTTPRequest` associated with this `HTTPService`
       * @property
       * @type {XMLHttpRequest}
       */
      get: function get() {
        if (this._xhr) {
          return this._xhr;
        }

        var xhr = new XMLHttpRequest();
        xhr.addEventListener('loadstart', this);
        xhr.addEventListener('load', this);
        xhr.addEventListener('loadend', this);
        xhr.addEventListener('progress', this);
        xhr.addEventListener('error', this);
        xhr.addEventListener('abort', this);
        this._xhr = xhr;
        return this._xhr;
      }
    }]);

    function HTTPService(params) {
      var _this;

      _classCallCheck(this, HTTPService);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HTTPService).call(this));
      _this.params = params;
      return _this;
    }
    /**
     * Handle an HTTP response usually to parse data
     * @param {XMLHttpRequest} xhr - Current request object
     * @returns {Blob|object|string} - Response with parsed data or Blob or text
     */


    _createClass(HTTPService, [{
      key: "response",
      value: function response(xhr) {
        if (!xhr) {
          return;
        }

        switch (xhr.responseType) {
          case 'json':
            return xhr.response;

          case 'text':
          case '':
            try {
              return JSON.parse(xhr.responseText);
            } catch (e) {
              return xhr.responseText;
            }

          default:
            // document, blob, ArrayBuffer
            return this.xhr.response;
        }
      }
      /**
       * How we handle request events to resolve or reject the promise of this service
       * @param {Event} e - XMLHTTPRequest event
       */

    }, {
      key: "handleEvent",
      value: function handleEvent(e) {
        if (e.type == 'load') {
          if (this.xhr.status >= 200 && this.xhr.status < 300) {
            this.resolve(this.response(this.xhr));
          } else {
            var error = new Error('Response error ' + this.xhr.status);
            error.xhr = this.xhr;
            this.reject(error);
          }
        } else if (e.type == 'abort') {
          var error = new Error('Request aborted');
          error.xhr = this.xhr;
          this.reject(error);
        } else if (e.type == 'error') {
          var error = new Error('Bad request');
          error.xhr = this.xhr;
          this.reject(error);
        }
      }
      /**
       * Prepare body for the request
       * @param {object} params - Parameters of the request
       * @returns {FormData} - Form data object we can use in send method of an opened HTTP request
       */

    }, {
      key: "requestBody",
      value: function requestBody(params) {
        if (!params.body) {
          return;
        }

        if (typeof params.body == 'string') {
          return params.body;
        }

        var data = new FormData(); // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects

        for (var dataItem in params.body) {
          data.append(dataItem, params.body[dataItem]);
        }

        return data;
      }
      /**
       * Abort a running request
       */

    }, {
      key: "abort",
      value: function abort() {
        this.xhr.abort();
      }
      /**
       * Prepare and set request headers
       * @param {XMLHttpRequest} xhr - Current request object
       * @param {object} params  - Parameters `{method: 'GET', headers: {'X-Text': 'My Value'}}`
       */

    }, {
      key: "requestHeaders",
      value: function requestHeaders(xhr, params) {
        if (params.headers) {
          for (var key in params.headers) {
            //Normalize name and value
            var value = params.headers[key];
            xhr.setRequestHeader(key.toLowerCase(), value.toString().trim());
          }
        }
      }
      /**
       * Prepare an URL for the request. Helps to inject parameters in the URL of the request.
       * @param {object} params - Parameters of the request
       * @returns {string} - New URL string.
       * @example myApi.requestUrl({url: 'https://jsonplaceholder.typicode.com/', path: {users:1}, query: {userId: 2}}); // https://jsonplaceholder.typicode.com/users/1?userId=2" 
       */

    }, {
      key: "requestUrl",
      value: function requestUrl(params) {
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
      /**
       * Send an HTTP request
       */

    }, {
      key: "send",
      value: function send() {
        var xhr = this.xhr;
        var params = this.params;
        var url = this.requestUrl(params);
        var method = params.method || "GET";

        if (xhr.readyState != 0 && xhr.readyState != 4) {
          // running
          this.reject(new Error('Still running'));
          return;
        }

        xhr.open(method, url);
        this.requestHeaders(xhr, params);
        xhr.send(this.requestBody(params));
      }
      /**
       * How we apply parameters when we call a service multiple times
       * @param {object} newParams - New parameters
       */

    }, {
      key: "applyParams",
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
       * Wrap an HTTP request as a Promise to comply with {@link Service} protocol
       * @property
       * @type function
       */

    }, {
      key: "executor",
      get: function get() {
        var self = this;
        return function (params, resolve, reject) {
          // Comply with Service protocol			
          self.applyParams(params);
          self.resolve = resolve;
          self.reject = reject;
          self.send();
        };
      }
    }]);

    return HTTPService;
  }(_serviceM.default);

  _exports.default = HTTPService;
  ;
});
