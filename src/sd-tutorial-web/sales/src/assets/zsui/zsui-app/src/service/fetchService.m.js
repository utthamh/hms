import Service from './service.m.js';

/**
 * Wraps a Fetch API to comply with {@link Service} protocol. Use it as a better alternative to {@link HTTPService} which is based on `XMLHTTPRequest`.
 * @exports FetchService 
 * @examples let userAPI = new FetchService({url: 'https://jsonplaceholder.typicode.com/users'});
  */
export default class FetchService extends Service {

	/**
	 * @param {object} params - Request parameters
	 */
	constructor(params) {
		super();
		this.params = params;
	}

	/**
	 * Prepare an URL for the request. Helps to inject parameters like `{query: {userId:1}, path: {users: 1}}` in the URL to get something like `https://jsonplaceholder.typicode.com/users/1?userId=2`
	 * @returns {string} - New URL string.
	 */
	get url() {
		var params = this.params;
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
	 * Default response handler. Will handle errors and parse the data in a most typical way. Override this method to support complex cases.
	 * @param {Response} response - Response of the request.
	 * @returns {Promise} - Promise of a processed results.
	 * @example userAPI.get({query:{_page: 2}}).then(userAPI.response) 
	 */
	response(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.json() || response.text();
		} else {
			var error = new Error(response.statusText)
			error.response = response
			throw error
		}
	}

	/**
	 * Create an HTTP request in a compatible with the {@link Service} protocol way.
	 * @param {object} params - Parameters of the request
	 */
	request(params) {
		this.applyParams(params);
		var prom = fetch(this.url, this.params);
		return prom;
	}
};