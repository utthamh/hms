/**
 * Module to help with storing and updating settings for components or apps.
 * @module configuration 
 * @example import configuration from 'zsui/configuration/configuration.m.js'
 */
export default {
	/**
	 * Configure event normally fired via `configure` method
	 * @event configure 
	 * @property {object} config - Reference an updated configuration. Use it as `event.detail.config` in event handlers
	 * @example window.addEventListener('configure', function(event) {console.log('config', event.detail.config);});
	 * @example var event = new CustomEvent('configure', { detail: { config: {test:1} } }); window.dispatchEvent(event);  
	 */

	/**
	 * Store configuration as an object
	 * @property
	 * @example var someComponent.someProp = configuration.config.someProp;
	 * @type {object}
	 */
	config: null,

	/**
	 * Configure a component
	 * @example configuration.configure({test:1})
	 * @param {...object=} - Use one or several configurations
	 * @fires configure
	 */
	configure: function () {
		if (!arguments.length) { return; }
		if (!this.config) { this.config = {}; }
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] != 'object') { continue; }
			Object.assign(this.config, arguments[i]);
		}

		var event = new CustomEvent('configure', { detail: { config: this.config } });
		if (typeof this.dispatchEvent == 'function') {
			this.dispatchEvent(event);
		} else {
			window.dispatchEvent(event);
		}
	}
};