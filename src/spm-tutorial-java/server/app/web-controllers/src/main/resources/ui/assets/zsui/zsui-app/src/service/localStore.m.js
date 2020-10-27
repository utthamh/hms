import Store from './store.m.js';


/**
 * Store data in localStorage.
 * @exports LocalStore
 * @example var store = new LocalStore();
 */
export default class LocalStore extends Store {

	/**
	 * Load an item from the store
	 * @param {string} key - Item key
	 * @param {=boolean} checkExpiration - Optionally check if item is expired
	 * @returns {object} - Item value. Null when not found. Null when expired.
	 * @example myStore.getItem('test');
	 */
	getItem(key, checkExpiration) {
		if (!this.isReady) { throw 'Storage not available'; }
		var value = window.localStorage.getItem(key);
		value = this.decrypt(value);
		if (checkExpiration && this.isExpired(key)) {
			if (typeof checkExpiration == 'function') {
				checkExpiration(value);
				return value;
			} else {
				this.deleteExpiration(key);
				this.removeItem(key);
				return null;
			}
		} else {
			return value;
		}
	}

	/**
	 * Default encryption method. Used before we save an item to the store.
	 * @param {object} value 
	 * @returns {object} - Encrypted value
	 */
	encrypt(value) {
		if (typeof value == 'object') {
			try {
				return JSON.stringify(value)
			} catch (e) {
				throw 'Invalid value to store ' + value
			}
		}
		return value + "";
	}

	/**
	 * Default decryption method. Used after we load an item from the store.
	 * @param {object} value - Encrypted value 
	 * @return {object} - Decrypted value
	 */
	decrypt(value) {
		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	}

	/**
	 * Save an item to the store
	 * @param {string} key - Item key
	 * @param {object} value - Item value
	 * @param {=number} expireInSeconds - How many seconds to store item
	 * @example myStore.setItem('test', 1);
	 */
	setItem(key, value, expireInSeconds) {
		if (!this.isReady) { throw 'Storage not available'; }
		window.localStorage.setItem(key, this.encrypt(value));
		if (expireInSeconds > 0) {
			this.setExpiration(key, expireInSeconds);
		} else {
			this.deleteExpiration(key);
		}
	}

	/**
	 * Remove item from the store
	 * @param {string} key - Item key
	 * @example myStore.removeItem('test');
	 */
	removeItem(key) {
		if (!this.isReady) { throw 'Storage not available'; }
		window.localStorage.removeItem(key);
	}

	/**
	 * Check if storage is available
	 */
	get isReady() {
		return window.localStorage;
	}
}