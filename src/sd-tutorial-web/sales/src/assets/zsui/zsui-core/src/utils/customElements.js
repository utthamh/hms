
/**
 * @namespace {object} zs
 */
var zs = (function (zs) {
	'use strict';

	// Warn in case of double include
	if (zs.customElement) {
		console.warn('zs.customElement helpers are already defined. Check if you included the script twice.');
	}

	/**
	 * Warn users if feature is deprecated and when it will be removed. You can shut it down.
	 * @param {string} name Name of the feature like "zs.myModule.myFeature" 
	 * @param {string} message Message to be displayed in the console warning like "Since v3.0. Will be removed in v4.0. Use this instead."
	 * @ignore
	 */
	zs.deprecated = function (name, message) {
		zs._deprecated = zs._deprecated || {};
		if (zs._deprecated[name]) { return; } // Only once per feature
		zs._deprecated[name] = name + ' is deprecated: ' + message;
		console.warn(zs._deprecated[name]);
	};

	
	/**
	 * Creates and returns a new debounced version of the passed function which will postpone its execution until after wait milliseconds have elapsed since the last time it was invoked. Useful for implementing behavior that should only happen after the input has stopped arriving. For example: rendering a preview of a Markdown comment, recalculating a layout after the window has stopped being resized, and so on.
	 * @param {function} func - Original function
	 * @param {number} wait - How much to wait before letting func to be called
	 * @param {boolean} immediate - Pass true for the immediate argument to cause debounce to trigger the function on the leading instead of the trailing edge of the wait interval. Useful in circumstances like preventing accidental double-clicks on a "submit" button from firing a second time.
	 * @deprecated Since v3.0. Will be removed in v4.0. Use lodash debounce or requestAnimationFrame instead.
	 * @todo Use domHelper.debounce instead
	 * @ignore
	 * @memberof zs
	 */
	zs.debounce = function (func, wait, immediate) {
		zs.deprecated('zs.debounce', 'Since v3.0. Will be removed in v4.0. Use lodash debounce or requestAnimationFrame instead');
		//! Debounce logic taken from http://underscorejs.org/#debounce, but modified to support canceling
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) { func.apply(context, args); return null; }
			return timeout;
		};
	};

	/**
	 * @description Adds a behavior to an element definition object. When we add a behavior to the element definition object we can pass special properties to define getters and setters, event listeners and attributes we observe. E.g. {myProp:1, myMethod: function() {}, events: {'click': function() {}}, properties: {test: {get: function() {}, set: function() {}}}, observedAttributes:['test']}. All behaviors will be mixed and applied to the original prototype of the HTML element.
	 * @param {object} obj - Element definition object
	 * @param {object} properties - New behavior to add 
	 * @ignore
	 */
	zs.addBehavior = function (obj, properties) {
		var events, propertyDescriptors, i;
		if (!properties) { return; }

		// Clone events
		if (properties.events) {
			events = Object.assign({}, properties.events);
		}

		Object.assign(obj, properties); // IE11 need a polyfill

		// Handle events
		if (events) {
			for (i in events) {
				zs.addCustomEvent(obj, i, events[i]);
			}
			delete obj.events;
		}

		// Handle observed attributes
		if (properties.observedAttributes) {
			if (!obj.observedAttributesList) {
				obj.observedAttributesList = [];
			}
			Array.prototype.push.apply(obj.observedAttributesList, properties.observedAttributes);
		}

		// Handle properties getters and setters
		if (properties.properties) {
			propertyDescriptors = Object.assign({}, properties.properties);
			Object.defineProperties(obj, propertyDescriptors);
		}
	};

	/**
	 * Add an event handler to the element definition object used when defining custom HTML elements
	 * @param {obj} obj - Element definition object
	 * @param {string} eventType - Event type name like "click"
	 * @param {function} eventHandler - Event handler
	 * @see zs.addBehavior
	 * @ignore
	 */
	zs.addCustomEvent = function (obj, eventType, eventHandler) {
		if (!obj.eventHandlers) { obj.eventHandlers = {}; }
		if (!obj.eventHandlers[eventType]) {
			obj.eventHandlers[eventType] = [];
		}
		if (eventHandler) {
			obj.eventHandlers[eventType].push(eventHandler);
		}
		return obj.eventHandlers[eventType];
	};

	/**
	 * Propagate an event from the source element to the target element
	 * @param {string} eventType 
	 * @param {HTMLElement} source 
	 * @param {HTMLElement} target
	 * @deprecated Should be part of zs.domHelper
	 * @ignore 
	 */
	zs.pipeEvent = function (eventType, source, target) {
		source.addEventListener(eventType, function (e) {
			var newEvent = new CustomEvent(e.type);
			if (e.detail) {
				Object.assign(newEvent.detail, e.detail);
			}
			target.dispatchEvent(newEvent);
		});
	};

	function setProto(A, B) {
		A.prototype = Object.create(
			B.prototype,
			{
				constructor: {
					configurable: true,
					writable: true,
					value: A
				}
			}
		);
	}

	
	// Detect if we can use classes for components and use them.
	 
	try {
		eval('\
		zs.createComponentClass = function (parentClass) {\
			return class elementClass extends parentClass {constructor() {super();this.init();}}\
		}');

	} catch(e) {
		zs.createComponentClass = function(parentClass) {
			var elementClassES5 = function (self) {			
				self = parentClass.call(this, self);				
				self.init();
				return self;
			};	
			setProto(elementClassES5, parentClass);
			return elementClassES5;		
		}		
	}

	/**
	 * @description Define a custom element and normalize across browsers. Helps to avoid caveats and provides shortcuts to handle events, extend existing elements and add new features.
	 * @param {HTMLElement} parentClass - Prototype of a new element. Should be an instance of HTMLElement.
	 * @param {string} isWhat - Name of the new element can be used as a tag name "&lt;my-element&gt;" or as "is" attribute value "&lt;p is='my-element'&gt;" 
	 * @param {string|null} tag - Tag name is used only when customizing built-ins. E.g. when extending the native HTMLFormElement you need to use "form" here so your new element will be used like &lt;form is="my-form"&gt;. Not recommended.
	 * @param {(array|object)=} behaviors - Optional list of behaviors to add to the new custom element. We can pass special properties to define getters and setters, event listeners and attributes we observe. E.g `{myProp:1, myMethod: function() {}, events: {'click': function() {}}, properties: {test: {get: function() {}, set: function() {}}}, observedAttributes:['test']}`. All behaviors will be mixed and applied to the original prototype of the HTML element.
	 */
	zs.customElement = function (parentClass, isWhat, tag, behaviors) {
		var params;

		var elementClass = zs.createComponentClass(parentClass);
		elementClass.prototype.init = function (t) {
			if (!this._isCreated) {
				// Add event listeners only once 			
				for (var i in this.eventHandlers) {
					var event = new CustomEvent(i);
					for (var j = 0; j < this.eventHandlers[i].length; j++) {
						this.addEventListener(event.type, this.eventHandlers[i][j]);
					}
				}	
				// Trigger create
				var event = new CustomEvent('create');
				this.dispatchEvent(event);	
				this._isCreated = true;
			}			
		}

		// Need to store "is" attribute in case element would be created manually.
		if (tag) { 
			elementClass.prototype._is = isWhat;
		}

		// Life-cycle callbacks		
		elementClass.prototype.connectedCallback = function () {
			if (typeof this.init == 'function') {this.init();}; // ensure create is called first

			// Patch "is" attribute for backward compatibility. Can't do it in the constructor
			if (this._is) {
				if (this.getAttribute('is') != this._is) {
					this.setAttribute('is', this._is);
				}
			}

			var event = new CustomEvent('attach');
			this.dispatchEvent(event);
		};

		elementClass.prototype.adoptedCallback = function () {
			var event = new CustomEvent('adopt');
			this.dispatchEvent(event);
		};
		elementClass.prototype.disconnectedCallback = function () {
			var event = new CustomEvent('detach');
			this.dispatchEvent(event);
		};
		elementClass.prototype.attributeChangedCallback = function (attributeName, oldValue, newValue, namespace) {
			if (typeof this.init == 'function') {this.init();}; // ensure create is called first
			var event = new CustomEvent('attributeChange', { detail: { attributeName: attributeName, oldValue: oldValue, newValue: newValue, namespace: namespace } });
			this.dispatchEvent(event);
		};

		// Add behaviors
		if (behaviors) {
			if (!Array.isArray(behaviors)) {
				behaviors = [behaviors];
			}
			for (var i = 0; i < behaviors.length; i++) {
				if (!behaviors[i]) {
					console.warn('One of behaviors is undefined for ' + isWhat + ' custom element');
				}
				zs.addBehavior(elementClass.prototype, behaviors[i]);
			}
		}

		// Handle observed attributes		
		if (elementClass.prototype.observedAttributesList) {
			elementClass.observedAttributes = elementClass.prototype.observedAttributesList.slice(0);
		}

		if (tag) {
			params = { extends: tag };
		}

		customElements.define(isWhat, elementClass, params);
		return customElements.get(isWhat);
	};


	return zs;
})(window.zs || {});
