/**
 * Service provides a standardize way to access and modify data
 * @exports Service
 * @example import Service from "./service/service.m.js"
 * @example let myService = new Service((params,resolve, reject) => {resolve({test:1})})
 */
export default class Service {


	/**
	 * Create an instance of a service
	 * @param {function} executor - Function to be used in call method to create a Promise
	 */
	constructor(executor) {
		if (executor) {
			this.executor = executor;
		}
	}


	/**
	 * Get a resource
	 * @return {Promise} - Promise
	 * @example myService.get({id:1}).then(data=>console.log(data));
	 */
	get(params) {
		params.method = 'GET';
		return this.request(params);
	}

	/**
	 * Create a new resource
	 * @return {Promise} - Promise
	 * @example myService.post({id:1, name: 'New name', value: 1}).then(data=>console.log(data));
	 */
	post(params) {
		params = params || {};
		params.method = 'POST';
		return this.request(params);
	}

	/**
	 * Update a resource
	 * @return {Promise} - Promise
	 * @example myService.put({id:1, name: 'New name', value: 1}).then(data=>console.log(data));
	 */
	put(params) {
		params = params || {};
		params.method = 'PUT';
		return this.request(params);
	}

	/**
	 * Modify a resource
	 * @return {Promise} - Promise
	 * @example myService.patch({id:1, name: 'New name'}).then(data=>console.log(data));
	 */
	patch(params) {
		params = params || {};
		params.method = 'PATCH';
		return this.request(params);
	}

	/**
	 * Delete a resource
	 * @return {Promise} - Promise
	 * @example myService.request({id:1}).then(data=>console.log(data));
	 */
	delete(params) {
		params = params || {};
		params.method = 'DELETE';
		return this.request(params);
	}

	/**
	 * Generic service service with parameters
	 * @return {Promise} - Promise
	 * @example myService.request({param:1}).then(data=>console.log(data));
	 */
	request(params) {
		if (!this.executor) { throw 'Service executor not provided'; }
		var self = this;
		return new Promise(function (resolve, reject) {
			self.executor(params, resolve, reject);
		});
	}
};