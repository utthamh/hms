/**
 * Class to create and store states of components or apps based on {@link https://developer.mozilla.org/en-US/docs/Web/API/|URLSearchParams}
 * @exports State
 * @extends URLSearchParams
 * @example var myState = new State({test:1});
 */
class State extends URLSearchParams {

	/**
	 * Create a state object
	 * @param {USVString=} init - A USVString instance, a URLSearchParams instance, a sequence of USVStrings, or a record containing USVStrings. Note that using a URLSearchParams instance is deprecated; soon browsers will just use a USVString for the init.
	 * @example var state = new State('param1=1&param2=2'); var state2 = new State({param1:1,param2:2});
	 */
	constructor(init) {
		super(init);
		if (typeof this.diff != 'function') { // Work around for weird Safari bug
			Object.assign(this, stateExtension);
		}
	}
}


let stateExtension = {
	/**
	 * Difference from another State instance
	 * @param {State} newStateObject - Another State instance to compare with
	 * @return {Object} - Detected changes presented as an object like `{editedKeys: [], deletedKeys: [], newKeys: [], changedKeys: []}`
	 * @example var myState = new State({test:1}); myState.diff(new State({test:2})); // {"editedKeys":["test"],"deletedKeys":[],"newKeys":[],"changedKeys":["test"]}
	 */
	diff(newStateObject) {
		var keys = Object.assign(this.toPlainObject(), newStateObject.toPlainObject()), // Combined set of keys			
			results = {
				editedKeys: [],
				deletedKeys: [],
				newKeys: [],
				changedKeys: []
			},
			self = this;

		for (var i in keys) {
			if (newStateObject.get(i) == null) {
				results.deletedKeys.push(i);
				results.changedKeys.push(i);
			} else if (self.get(i) == null) {
				results.newKeys.push(i);
				results.changedKeys.push(i);
			} else if (self.get(i) !== newStateObject.get(i)) {
				results.editedKeys.push(i);
				results.changedKeys.push(i);
			}
		};
		return results;

	},

	/**
	 * Checks if the state objects is identical to another one
	 * @param {State} toAnotherState - Another state object to compare with
	 */
	isEqual(toAnotherState) {
		// Check size first
		if (this.toString().length != toAnotherState.toString().length) { return false; }
		let diff = this.diff(toAnotherState);
		return diff.changedKeys.length == 0;
	},

	/**
	 * Converts the state object to JSON object
	 * @returns {object} - Plain JSON object 
	 */
	toPlainObject() {
		var obj = {};
		this.forEach(function (value, key) {
			obj[key] = value;
		});
		return obj;
	},

	/**
	 * Update the state with a plain JSON object
	 * @param {object} stringOrJsonOrState 
	 */
	update(stringOrJsonOrState) {
		var changes = new State(stringOrJsonOrState);
		var changesObj = changes.toPlainObject();
		for (var i in changesObj) {
			let key = i;
			let value = changesObj[i];
			this.set(key, value);
		};
	}
}

Object.assign(State.prototype, stateExtension);

/**
 * @exports StateManager
 * @example var stateManager = new StateManager(window.location.href);
 */
class StateManager {

	/**
	 * @param {object|State|URLSearchParams|string} urlStringOrStateObject - We can initialize our state manager with a State object or a string.
	 */
	constructor(urlStringOrStateObject) {
		window.addEventListener("hashchange", this);
		window.addEventListener("popstate", this);
		if (typeof urlStringOrStateObject == 'string') {
			this.url = new URL(urlStringOrStateObject);
		} else if (urlStringOrStateObject instanceof URLSearchParams) {
			this.state = new State(urlStringOrStateObject.toString())
		} else if (urlStringOrStateObject instanceof Object) {
			this.state = new State(urlStringOrStateObject);
		}

	}


	handleEvent(event) {
		if (event.type == 'popstate' && event.state) {
			this.state = new State(event.state);
			return;
		}
		this.url = new URL(window.location.href);
	}

	/**
	 * Store current URL object 
	 * @type {object}
	 */
	set url(newURLObject) {
		if (!this._url || this._url.href != newURLObject.href) {
			// Sync state
			let firstTime = this._url === undefined;
			this._url = newURLObject; // Should go before state update to avoid endless loop
			this.state = this.urlToState(newURLObject);
			this.onstatechange(firstTime);
		}

	}
	get url() {
		return this._url;
	}

	/** 
	 * State 
	 * @type {State} 		 
	 */
	set state(newObject) {
		if (this._state === undefined || !this._state.isEqual(newObject)) {

			if (this._state) { this._prevStateString = this._state.toString(); }
			this._state = newObject;

			// Sync URL
			let newUrl = this.stateToUrl(newObject);
			if (this._url === undefined || newUrl.href != this._url.href) {
				this.url = newUrl;
			}
		}
	}
	get state() {
		return this._state;
	}

	/**
	 * Update our state with a plain JSON object
	 * @param {object} stringOrJsonOrState 
	 */
	update(stringOrJsonOrState) {
		var newState = new State(this.state);
		newState.update(stringOrJsonOrState);
		this.state = newState;
	}

	/**
	 * Default way to reflect State in URL
	 * @param {State} newStateObject 
	 */
	stateToUrl(newStateObject) {
		var url = new URL(this._url ? this._url.href : window.location.href);
		var newState = new State(newStateObject.toString()); // clone
		if (newState.get('hash') != null) {
			url.hash = newState.get('hash');
			newState.delete('hash');
		}
		if (newState.get('pathname') != null) {
			url.pathname = newState.get('pathname');
			newState.delete('pathname');
		}
		url.search = '?' + newState.toString().replace(/\+/ig, "%20"); // See: https://stackoverflow.com/questions/1211229/in-a-url-should-spaces-be-encoded-using-20-or
		return url;
	}

	/**
	 * Default way to reflect URL in State
	 * @param {URL} url - URL object
	 */
	urlToState(url) {
		var state = new State(url.searchParams, function () { });
		state.append('hash', url.hash);
		state.append('pathname', url.pathname);
		return state;
	}

	/**
	 * Handle change of state
	 * @param {object} newObject - Object with changes in the state to apply
	 * @param {dontPush} boolean - Skip pushing the state and change the URL. You might need this initially.
	 * @fires statechange
	 */
	onstatechange(dontPush) {
		var newState = this.state, diff, prevState;

		// Detect changes
		if (this._prevStateString) {
			prevState = new State(this._prevStateString);

		} else {
			prevState = new State();
		}
		diff = prevState.diff(newState);

		if (!dontPush) {
			history.pushState(newState.toPlainObject(), document ? document.head.title : '', this.url.href);
		}

		var event = new CustomEvent('statechange', { detail: { newState: newState, diff: diff, stateManager: this } });
		window.dispatchEvent(event);
	}

	/**
	 * Remove all event listeners
	 */
	cleanUp() {
		window.removeEventListener('hashchange', this);
		window.removeEventListener('popstate', this);
	}
};

export { StateManager, State };