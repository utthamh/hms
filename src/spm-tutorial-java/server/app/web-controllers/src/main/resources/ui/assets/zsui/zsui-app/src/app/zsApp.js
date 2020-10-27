var zs = (function(zs) {
	'use strict';

	/**
	 * State management behavior for components.
	 * @deprecated Use state component instead. Will be removed in v4.0 
	 * @namespace
	 * @todo add deleteState method to support removing items from storage
	 */ 
	zs.state = {
		
		/**
		 * Store current URL object 
		 * @type {object}
		 */
		url: null,
		
		/**
		 * Query string
		 * @type {string}
		 */
		query: null,

		/** 
		 * State 
		 * @type {object} 		 
		 */
		state: null,
		
		/**
		 * State change event
		 * @event statechange
		 * @type {object}
		 * @property {object} 	newState - New state of the component.
		 * @property {object} 	changed - Changed properties.
		 * @todo: Link to event is broken in the docs https://github.com/jsdoc3/jsdoc/issues/1425
		 */	

		/**
		 * A simple method to parse and store query string of the URL. Doesn't cover all edge cases. You can use Url native API instead or similar. Override when necessary.
		 * @param {string} query - Query string to parse "?param1=value1&amp;param2=value2"
		 * @return {object} Query string object like {param1: value1, param2: value2}
		 */
		parseQuery: function (query) { 
			var i;
			if (!query) { return null; }
			if (query.slice(0, 1) == '?') {
				query = query.slice(1);
			}
			
			// Empty query
			this.query = this.query || {};
			for (i in this.query) {
				delete this.query[i];
			}

			var vars = query.split('&');
			for (i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				this.query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
			}
			return this.query;
		},

		/**
		 * Called after URL is updated, defines what is reflected in the state and calls updateState
		 */
		reflectState: function () {  
			var params = {
				hash: this.url.hash,
				pathname: this.url.pathname
			};
			Object.assign(params, this.query);
			this.updateState(params);
		},	
		
		/**
		 * Update state 
		 * @param {object} newObject - Object with changes in the state to apply
		 * @fires statechange
		 */
		updateState: function (newObject) {
			var whatChanged;
			var combinded = Object.create(this.state);
			Object.assign(combinded, newObject);
			if (this.state) {
				for (var i in combinded) {
					if (this.state[i] != combinded[i]) {
						whatChanged = whatChanged || {};
						whatChanged[i] = combinded[i];
					}
				}
			}
			this.state = this.state || {};
			Object.assign(this.state, combinded);
			var event = new CustomEvent('statechange', { detail: { newState: this.state, changed: whatChanged } });
			this.dispatchEvent(event);
		},

		/**
		 * Parse URL string into object
		 * @param {string} url - String with URL to parse
		 * @return {object} URL object
		 */
		parseUrl: function(url) {
			var a = document.createElement('a');
			a.href = url;
			this.url = {};

			Object.assign(this.url, {
				href: a.href,
				protocol: a.protocol,
				host: a.host,
				hostname: a.hostname,
				port: a.port,
				pathname: a.pathname,
				search: a.search,
				hash: a.hash,
				username: a.username,
				password: a.password,
				origin: a.origin
			});

			// Normalize URL (IE11 vs others)
			if (this.url.pathname && this.url.pathname.slice(0,1) == '/') {
				  this.url.pathname = this.url.pathname.slice(1);
			}
			if (this.url.search && this.url.search.slice(0,1) == '?') {
				  this.url.search = this.url.search.slice(1);
			}
			return this.url;
		},

		/**
		 * React on hash changes to update the state
		 * @listens hashchange
		 */
		watchLocation: function() {
			var comp = this;
			window.addEventListener("hashchange", function () {
				comp.updateUrl();
			});
		},

		/**
		 * Save the state to the storage. By default localStorage will be used.
		 * @param {string} name - Storage name to be used. Username could be used here to separate storage for multiple users.
		 * @param {object=} state - What state object to use. Current state of the component will be used by default.
		 */		
		saveState: function (name, state, exclude) {
			if (!localStorage) {return false;}
			var toSave = {};
			Object.assign(toSave, state || this.state);
			
			// Remove unwanted properties
			exclude = exclude || ['hash', 'pathname']; // By default we want to exclude URL based parameters from saving to localStorag.
			for (var i in exclude) {
				delete toSave[exclude[i]];
			}

			localStorage.setItem(name , JSON.stringify(toSave));
		},

		/**
		 * Load state from the storage and apply to the component.
		 * @param {string} name - Storage name
		 */
		loadState: function(name) {
			if (!localStorage) {return false;}
			var str = localStorage.getItem(name);
			if (str) {
				this.updateState(JSON.parse(str));
			}
		},

		/**
		 * Convert object to URL query string like "param1=value1&param2=value2..."
		 * @param {object} obj - Object to convert
		 * @return {string} Query string
		 */
		serialize: function (obj) {
			var str = [];
			if (!obj) { return; }
			for (var p in obj) {
				if (!obj.hasOwnProperty || obj.hasOwnProperty(p)) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			}
			return str.join("&");
		},

		/**
		 * Convert URL object to URL string
		 * @param {object} url - Object to convert
		 * @return {string} URL
		 */
		joinUrl: function (url) {
			url = url || this.url;
			if (url.href) {return url.href};
			var newUrl = document.createElement('a');
			newUrl.href = location.href;
			Object.assign(newUrl, url);			
			return newUrl.href;
		},

		/**
		 * Drives the state of the component through URL.
		 * @param {string=} newUrl - New URL. Current location will be used by default		 
		 */
		updateUrl: function(newUrl) {
			this.parseUrl(newUrl || location.href);
			this.parseQuery(this.url.search);
			this.reflectState();
		},

		/**
		 * Define all event listeners
		 * @member
		 */
		events: {
			create: function() {
				this.watchLocation();
			}
		}		
	};

	/**
	 * Service behavior for components. Allows to define and call APIs to get data.
	 * @deprecated Use service component instead. Will be removed in v4.0 
	 * @namespace
	 */ 
	zs.service = {
		
		/**
		 * Services are shared across all the instances of a component
		 * @type {object}
		 */
		services: {}, 

		/**
		 * Register a service
		 * @param {string} name - Name of the service to register. You can namespace names for different components.
		 */
		registerService: function(name, fn) {
			this.services[name] =  fn;
		},

		/**
		 * Call a services
		 * @param {string} name - Name of the service to call
		 * @param {object=} params - Parameters of the call
		 * @return {promise} All service calls return a promise.
		 */
		service: function(name, params) {
			if (!this.services[name]) {return;}
			var comp = this;
			return new Promise(function(resolve, reject) {
				comp.services[name](params, resolve, reject);
				//resolve({test:1});
			});
		},

		/**
		 * Save or load data from cache
		 * @param {string} key - Key of the data to load
		 * @param {object} data - Data to save
		 * @param {number=} expire - How many milliseconds to store the data for.		 * 
		 * @return {object|false} -  Cached data or false if it is expired.
		 */
		cache: function(key, data, expire) {
			if (!localStorage) {return false;} // In IE11 localStorage is disabled for localhost or via file:///. Solution: Add to trusted zone.

			if (!data) {
				// Load data
				var str = localStorage.getItem(key);
				if (!str) {return false;}
				var obj = JSON.parse(str);
				if (!obj.data) {return false}; // No data
				if (obj.expire) { // Check expiration
					var now = (new Date).valueOf();
					if (now>obj.expire) {
						return false;
					} 
				}
				return obj.data
			}

			// Save data
			var toSave = {
				data: data
			};	

			// Add expiration marker
			if (expire) {
				var expireOn = new Date();
				expireOn = (new Date).valueOf() + expire;	
				toSave.expire = expireOn;
			}

			localStorage.setItem(key , JSON.stringify(toSave));
		}	
	};

	/**
	 * Configuration behavior for components.
	 * @deprecated Use configuration component instead. Will be removed in v4.0 
	 * @namespace 
	 */
	zs.configuration = {

		/**
		 * Configure event
		 * @event configure
		 * @type {object}
		 */	

		/**
		 * Shared configuration for all components on the page
		 * @type {object}
		 */
		config: {},
		
		/**
		 * Configure a component
		 * @param {...object=} - Use one or several configurations
		 * @fires configure
		 */
		configure: function() {
			if (!arguments.length) {return;}
			if (!this.config) {this.config = {};}
			for (var i=0;i<arguments.length;i++) {
				if (typeof arguments[i] != 'object') {continue;}
				Object.assign(this.config, arguments[i]);
			}
			var event = new CustomEvent('configure');					
			this.dispatchEvent(event);
		}
	};
	
	
	/**
	 * Application behavior
	 * @namespace
	 */
	zs.app = {
		
		/**
		 * Component ready event
		 * @event ready
		 * @type {object}
		 * @todo: Link to event is broken in the docs https://github.com/jsdoc3/jsdoc/issues/1425
		 */	

		/**
		 * Call this when you think everything is ready.
		 * @fires ready
		 */
		ready: function() {
			var event = new CustomEvent('ready');					
			this.dispatchEvent(event);
		}
	};
	
	/**
	 * Application component to be used for inheritance and composition
	 * @constructor 
	 * @deprecated Use state, configuration or service components instead. Will be removed in v4.0 
	 * @extends HTMLElement 
	 */
	zs.appElement =  zs.customElement(HTMLElement, 'zs-app', 'div', [zs.configuration, zs.state, zs.service, zs.app]);
	return zs;
})(window.zs || {});