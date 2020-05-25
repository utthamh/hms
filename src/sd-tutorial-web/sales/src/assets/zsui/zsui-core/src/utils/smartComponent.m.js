var caseMap = {};
var DASH_TO_CAMEL = /-[a-z]/g;
var CAMEL_TO_DASH = /([A-Z])/g;

/**
 * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
 * (e.g. `fooBarBaz`).
 *
 * @param {string} dash Dash-case identifier
 * @return {string} Camel-case representation of the identifier
 * @deprecated Moved to smart component. Will be deleted in v4.0 by 2020
 */
function dashToCamelCase(dash) {
	return caseMap[dash] || (
		caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL,
			function (m) { return m[1].toUpperCase(); }
		)
	);
}

/**
 * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
 * (e.g. `foo-bar-baz`).
 *
 * @param {string} camel Camel-case identifier
 * @return {string} Dash-case representation of the identifier
 * @deprecated Moved to smart component. Will be deleted in v4.0 by 2020 
 */
function camelToDashCase(camel) {
	return caseMap[camel] || (
		caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase()
	);
}

/**
 * This behavior implements a pattern to keep properties and attributes in sync. Uses getters and setters and works with observedAttributes. 
 * @namespace {object} syncPropAttr
 * @deprecated Moved to smart component. Will be deleted in v4.0 by 2020
 */
var syncPropAttr = {
	/**
	 * Unify how we get and store a value for the property and enable overrides.
	 * @param {string} name Name of the property. 
	 * @return {string} Property value
	 */
	propertyGet: function (name) {
		return this['_' + name];
	},

	/**
	 * Converts a value of a property to attribute value
	 * @param {any} value Property value
	 * @return {string} attribute value
	 */
	propToAttrValue: function (value) {
		if (value == null) { return ""; }
		return String(value);
	},

	/**
	 * Set a property value and optionally notify when value changes
	 * @param {string} name Name of the property to set
	 * @param {*} newValue New value for the property
	 * @param {?function} onChange Optional callback
	 */
	propertySet: function (name, newValue, onChange) {
		var oldValue = this['_' + name];
		this['_' + name] = newValue;
		var attrName = this.propToAttrName(name);
		var attrValue = this.getAttribute(attrName);
		var attrNewValue = this.propToAttrValue(newValue);
		if (attrNewValue != attrValue) {
			this.setAttribute(attrName, attrNewValue);
		}
		if (oldValue != newValue && typeof onChange == 'function') {
			onChange.apply(this, [name, newValue, oldValue]);
		}
	},

	/**
	 * Convert attribute name from dash case like "my-name" to property name in lower camel case like "myName".
	 * @param {string} attrName Property name
	 * @returns {string} Property name
	 */
	attrToPropName: function (attrName) {
		return dashToCamelCase(attrName);
	},


	/**
	 * Convert property name from lower camel case like "myName" to attribute name in dash case like "my-name".
	 * @param {string} propName Property name
	 * @returns {string} Attribute name
	 */
	propToAttrName: function (propName) {
		return camelToDashCase(propName);
	},

	/**
	 * Align a property value with changed attribute value
	 * @param {string} name Attribute name that was changed recently
	 * @param {string} value New value of the attribute
	 * @param {string} type Type of the property
	 */
	syncAttr: function (name, value, type) {
		var propName = this.attrToPropName(name);
		var propValue = this[propName];
		var propNewValue = this.attrToPropValue(propName, value, type);

		if (propNewValue != propValue) {
			this[propName] = propNewValue;
		}
	},

	/**
	 * Convert an attribute value to property value
	 * @param {string} propName Name of the property 
	 * @param {any} value Value of the property 
	 * @param {?string} type Type of the property. Can be detected. 'string' by default.
	 */
	attrToPropValue: function (propName, value, type) {
		var propType = type || typeof this[propName];
		if (propType == 'undefined' || propType == 'object') {
			propType = 'string';
		}
		switch (propType) {
			case 'number':
				return Number(value);
			case 'boolean':
				return value == 'true' || value == '';
			default: // String
				return value;
		}
	},

	/**
	 * Set synchronization between properties and observed attributes. 
	 * @param {object} params Use an object to specify which properties and attributes to synchronize. E.g. {'attr-name': {type: 'string', onChange: function(newValue, oldValue){}}}
	 * @see zs.addBehavior
	 */
	syncObservedAttr: function (params) {
		if (!this.observedAttributes) { return; }
		var self = this;
		self.observedAttributes.forEach(function (attrName) {

			var param = params[attrName];
			if (!param) { return; }
			param = Object.assign({ type: 'string', onChange: null }, param);
			self.addEventListener('attributeChange', function (event) {
				if (attrName == event.detail.attributeName) {
					this.syncAttr(event.detail.attributeName, event.detail.newValue, param.type);
				}
			});

			var propName = self.attrToPropName(attrName);
			self.syncProp(propName, param.onChange);
		});
	},

	/**
	 * Align a property value with an attribute value using getters and setters. Should be called once for each targeted property.  
	 * @param {string} propName Name of the property.
	 * @param {?function} onChange Callback to notify when changed.
	 */
	syncProp: function (propName, onChange) {
		var descriptor = {
			get: function () {
				return this.propertyGet(propName);
			},
			set: function (newValue) {
				this.propertySet(propName, newValue, onChange)
			}
		}
		Object.defineProperty(this, propName, descriptor);
	}
};

/**
 * Help to handle rendering of elements between creating and attaching to the DOM. You can set "shouldRender" property after creating an element.
 * @namespace {object} zs.smartRender
 * @deprecated Moved to smart component. Will be deleted in v4.0 by 2020
 */
var smartRender = {
	/**
	 * Calculated properties
	 * 
	 * @private
	 * @type {Object}
	 */
	properties: {

		/**
		* Flag to trigger rendering of the element. Will render if the element is already attached to the DOM.
		* @memberof zs.smartRender
		* @type {boolean}
		*/
		shouldRender: {
			get: function () {
				return this._shouldRender;
			},
			set: function (newValue) {
				if (newValue && this.isAttached) {
					if (typeof this.render == 'function') {
						this.render();
						this._shouldRender = false;
					}
				}
				this._shouldRender = newValue;
			}
		},

		/**
		 * Flag to detect if an element is attached to the DOM or not. Will call render if shouldRender flag is set.
		 * @memberof zs.smartRender
		 * @type {boolean}
		 */
		isAttached: {
			get: function () {
				return this._isAttached;
			},
			set: function (newValue) {
				if (newValue && this.shouldRender) {
					if (typeof this.render == 'function') {
						this.render();
						this._shouldRender = false;
					}
				}
				this._isAttached = newValue;
			}
		}
	},
	events: {
		attach: function () {
			this.isAttached = true;
		},
		detach: function () {
			this.isAttached = false;
		}
	}
}

/**
 * Block an event. Use it as an event handler for addEventListener method or inside "events" object.
 * @param {object} e Event to block.
 * @see zs.addBehavior
 */
var preventEvent = function (e) {
	e.stopPropagation();
	e.preventDefault();
}

// Add smart behaviors to zs namespace for backward compatibility.
window.zs = window.zs || {};
window.zs.syncPropAttr = syncPropAttr;
window.zs.smartRender = smartRender;
window.zs.preventEvent = preventEvent;

export default { syncPropAttr, smartRender, preventEvent };
