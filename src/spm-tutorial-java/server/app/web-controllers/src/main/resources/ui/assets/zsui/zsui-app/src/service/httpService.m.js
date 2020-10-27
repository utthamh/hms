


import Service from './service.m.js';
// URLSearchParams, URL

/**
 * Creates a wrapper around `XMLHTTPRequest` and complies with {@link Service} protocol
 * @exports HTTPService
 * @param {object} params - Request parameters
 * @example var userAPI = new HTTPService({url: 'https://jsonplaceholder.typicode.com/users'});
 */
export default class HTTPService extends Service {

	/**
	 * Creates and returns an `XMLHTTPRequest` associated with this `HTTPService`
	 * @property
	 * @type {XMLHttpRequest}
	 */
	get xhr() {
		if (this._xhr) { return this._xhr; }
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

	constructor(params) {
		super();
		this.params = params;
	}

	/**
	 * Handle an HTTP response usually to parse data
	 * @param {XMLHttpRequest} xhr - Current request object
	 * @returns {Blob|object|string} - Response with parsed data or Blob or text
	 */
	response(xhr) {
		if (!xhr) { return; }
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
			default: // document, blob, ArrayBuffer
				return this.xhr.response;
		}
	}
	/**
	 * How we handle request events to resolve or reject the promise of this service
	 * @param {Event} e - XMLHTTPRequest event
	 */
	handleEvent(e) {
		if (e.type == 'load') {
			if (this.xhr.status >= 200 && this.xhr.status < 300) {
				this.resolve(this.response(this.xhr));
			} else {
				var error = new Error('Response error ' + this.xhr.status)
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
	requestBody(params) {
		if (!params.body) { return; }
		if (typeof params.body == 'string') { return params.body; }
		var data = new FormData(); // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
		for (var dataItem in params.body) {
			data.append(dataItem, params.body[dataItem]);
		}
		return data;
	}

	/**
	 * Abort a running request
	 */
	abort() {
		this.xhr.abort();
	}

	/**
	 * Prepare and set request headers
	 * @param {XMLHttpRequest} xhr - Current request object
	 * @param {object} params  - Parameters `{method: 'GET', headers: {'X-Text': 'My Value'}}`
	 */
	requestHeaders(xhr, params) {
		if (params.headers) {
			for (var key in params.headers) { //Normalize name and value
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
	requestUrl(params) {
		var url = new URL(params.url);
		if (params.path) {
			let pathname = url.pathname;
			// {items: 1} -- > /items/1 
			for (let i in params.path) {
				pathname += "/" + encodeURIComponent(i) + '/' + encodeURIComponent(params.path[i]);
			}
			url.pathname = pathname.replace('//', '/').replace('\\/', '/');
		}
		if (params.query) {
			// {itemId: 1} --> ?itemId = 1
			let search = url.searchParams;
			for (let i in params.query) {
				search.append(i, params.query[i]);
			}
			url.search = search.toString();
		}
		return url.href;
	}

	/**
	 * Send an HTTP request
	 */
	send() {
		var xhr = this.xhr;
		var params = this.params;
		var url = this.requestUrl(params);
		var method = params.method || "GET";

		if (xhr.readyState != 0 && xhr.readyState != 4) { // running
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
	applyParams(newParams) {
		var params = Object.assign(Object.create(newParams || {}), newParams);
		this.params = this.params || {};
		// mix sections first
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
	get executor() {
		var self = this
		return function (params, resolve, reject) { // Comply with Service protocol			
			self.applyParams(params);
			self.resolve = resolve;
			self.reject = reject;
			self.send();
		}
	}
};