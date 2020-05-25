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
    global.serviceM = mod.exports;
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

  /**
   * Service provides a standardize way to access and modify data
   * @exports Service
   * @example import Service from "./service/service.m.js"
   * @example let myService = new Service((params,resolve, reject) => {resolve({test:1})})
   */
  var Service =
  /*#__PURE__*/
  function () {
    /**
     * Create an instance of a service
     * @param {function} executor - Function to be used in call method to create a Promise
     */
    function Service(executor) {
      _classCallCheck(this, Service);

      if (executor) {
        this.executor = executor;
      }
    }
    /**
     * Get a resource
     * @return {Promise} - Promise
     * @example myService.get({id:1}).then(data=>console.log(data));
     */


    _createClass(Service, [{
      key: "get",
      value: function get(params) {
        params.method = 'GET';
        return this.request(params);
      }
      /**
       * Create a new resource
       * @return {Promise} - Promise
       * @example myService.post({id:1, name: 'New name', value: 1}).then(data=>console.log(data));
       */

    }, {
      key: "post",
      value: function post(params) {
        params = params || {};
        params.method = 'POST';
        return this.request(params);
      }
      /**
       * Update a resource
       * @return {Promise} - Promise
       * @example myService.put({id:1, name: 'New name', value: 1}).then(data=>console.log(data));
       */

    }, {
      key: "put",
      value: function put(params) {
        params = params || {};
        params.method = 'PUT';
        return this.request(params);
      }
      /**
       * Modify a resource
       * @return {Promise} - Promise
       * @example myService.patch({id:1, name: 'New name'}).then(data=>console.log(data));
       */

    }, {
      key: "patch",
      value: function patch(params) {
        params = params || {};
        params.method = 'PATCH';
        return this.request(params);
      }
      /**
       * Delete a resource
       * @return {Promise} - Promise
       * @example myService.request({id:1}).then(data=>console.log(data));
       */

    }, {
      key: "delete",
      value: function _delete(params) {
        params = params || {};
        params.method = 'DELETE';
        return this.request(params);
      }
      /**
       * Generic service service with parameters
       * @return {Promise} - Promise
       * @example myService.request({param:1}).then(data=>console.log(data));
       */

    }, {
      key: "request",
      value: function request(params) {
        if (!this.executor) {
          throw 'Service executor not provided';
        }

        var self = this;
        return new Promise(function (resolve, reject) {
          self.executor(params, resolve, reject);
        });
      }
    }]);

    return Service;
  }();

  _exports.default = Service;
  ;
});
