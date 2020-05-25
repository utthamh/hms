// require zs.customElements, zs.validation, zs.clear
var zs = (function (zs) {
	'use strict';
	/**
	 * Behavior for zs-field custom element
	 * @namespace
	 */
	zs.field = {
		_name: null,
		_value: null,
		/**
		 * Stores field element
		 */
		fieldElement: null,
		/**
		 * Stores label element
		 */
		labelElement: null,
		ignoreChange: false,
		fieldContainer: null,
		isRendered: false,
		/** 
		 * Debounce delay, undefined => no debounce; >=0 => via zs.debounce
		 */
		debounceDelay: 0, //  undefined => no debounce; >=0 => via zs.debounce
		renderTimer: null,
		/**
		 * Blocks render on attribute change one time
		 */
		blockAttrRender: false,
		/**
		 * Blocks render on attribute change permanently
		 */
		blockAttrRenderAlways: false,
		/**
		 * Blocks render on attach one time
		 */
		blockAttachRender: false,
		/**
		 * Blocks render on attach permanently
		 */
		blockAttachRenderAlways: false,
		setValue: function (str) {
			var newValue;
			if (str == null) { // Null or undefined should be converted to null.
				newValue = null;
			} else {
				newValue = str + '';
			}

			// Sync with attribute
			if (newValue != this.getAttribute('value')) {
				this.setAttribute('value', newValue);
			}

			this._value = newValue;
		},
		getValue: function () {
			if (this._value == null) { return ''; }
			return this._value;
		},
		getName: function () {
			return this._name || '';
		},
		setName: function (str) {
			var newValue
			if (str == null) { // Null or undefined should be converted to null.
				newValue = null;
			} else {
				newValue = str;
			}

			// Sync with attribute
			if (newValue != this.getAttribute('name')) {
				this.setAttribute('name', newValue);
			}

			this._name = newValue;
		},
		/**
		 * Clears field element by removing all children
		 */
		clearField: function () {
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		},
		/**
		 * Detects and triggers browser to finish rendering of our component
		 * @deprecated Since v3.1. Will be removed in v4.0. Listen to render event instead.
		 */
		whenRendered: function () {
			zs.deprecated('zs.field.whenRendered','Since v3.1. Will be removed in v4.0. Listen to render event instead.');
			var comp = this;
			if (!this.fieldElement) { return new Promise(function (resolve, reject) { resolve(); }); }
			return new Promise(function (resolve, reject) {
				resolve(comp.fieldElement.offsetHeight + 0);
			});
			comp.isRendered = true;
		},
		/**
		 * Used to render only label
		 */
		renderLabel: function () {
			this.labelElement = this.querySelector('label');
			if (!this.labelElement && this.getAttribute('label')) {
				this.labelElement = document.createElement('label');
				this.labelElement.innerText = this.getAttribute('label');
				this.appendChild(this.labelElement);
			} else if (this.getAttribute('label')) {
				this.labelElement.innerText = this.getAttribute('label');
			}
		},
		wrapField: function (fieldElement) {
			this.fieldContainer = this.querySelector('span');

			if (this.fieldContainer) {
				this.fieldContainer.appendChild(fieldElement);
				return this.fieldContainer;
			} else {
				this.fieldContainer = document.createElement('span');
				this.fieldContainer.appendChild(fieldElement);
				return this.fieldContainer;
			}
		},
		/**
		 * Used to render only field
		 */
		renderField: function () {
			if (!this.fieldElement && this.getAttribute('type')) {
				this.fieldElement = document.createElement('input');
				this.fieldElement.setAttribute('type', this.getAttribute('type'));

				// Events
				//zs.pipeEvent('change', this.fieldElement, this); // Change event bubbles. We don't have to propagate is manually.
				zs.pipeEvent('blur', this.fieldElement, this); // Blur doesn't bubble
				zs.pipeEvent('focus', this.fieldElement, this); // Focus doesn't bubble

				this.fieldElement.setAttribute('value', this.getValue());
				this.appendChild(this.wrapField(this.fieldElement));

			} else if (this.fieldElement && this.getAttribute('type')) {
				this.fieldElement.setAttribute('value', this.getValue());
			}
		},
		/**
		 * Decorates field, assigns relevant CSS
		 */
		decorate: function () {
			this.classList.add('zs-field');
			if (this.fieldContainer) {
				this.fieldContainer.style.position = 'relative';
			}

			// Transfer placeholder
			if (this.fieldElement && this.getAttribute('placeholder')) {
				this.fieldElement.setAttribute('placeholder', this.getAttribute('placeholder'));
			}
		},
		/**
		 * Async render based on delay value passed
		 * @param debounceDelay {Number} delay in milliseconds
		 */
		waitAndRender: function (debounceDelay) {
			var comp = this;
			debounceDelay = debounceDelay || this.debounceDelay;
			// Debounce
			if (!this.renderWaitId && debounceDelay == null) { // No debounce
				this.render();
			} else if (!this.renderWaitId) {  // Debouncing

				// Set the function
				this.renderDebounced = zs.debounce(function () {
					comp.render();
					comp.renderWaitId = null;
				}, debounceDelay);

				// Remember the ID in case we want to cancel it
				this.renderWaitId = this.renderDebounced();
			}
		},
		/**
		 * Renders label and field element
		 */
		render: function () {
			//console.error('render field');
			if (this.blockRender) { this.blockRender = false; return; }
			var comp = this;
			if (this.renderWaitId) {
				clearTimeout(this.renderWaitId);
				this.renderWaitId = null;
			}

			// Init
			var viewMode = comp.getAttribute('view');

			// Label
			comp.renderLabel();

			// Input
			comp.renderField();

			// Decorate field
			comp.decorate();

			comp.dispatchEvent(new CustomEvent('render'));

			comp.isRendered = true;
		},
		update: function () {

		},
		/**
		 * @type {Array} Specifies array of observed attributes
		 */
		observedAttributes: ['name', 'value', 'view', 'type', 'label'],
		events: {
			render: function () {
				this.isRendered = true;
			},
			/**
			 * Triggered when an element is attached to DOM
			 * @event attach 
			 */
			attach: function () {
				if (this.blockAttachRenderAlways) { return; }
				if (this.blockAttachRender) { this.blockAttachRender = false; return; }
				if (this.innerHTML != '') {
					this.innerHTML = '';
					this.fieldContainer = null;
					this.fieldElement = null;
					this.labelElement = null;
					this.clearIcon = null;
					this.clearInput = null;
				}

				this.render();
			},
			/**
			 * Triggered when an element is created
			 * @event create 
			 */
			create: function () {
				if (this.getAttribute('value') != this.value) {
					this.value = this.getAttribute('value');
				}
				if (this.getAttribute('name') != this.name) {
					this.name = this.getAttribute('name');
				}
			},

			change: function (e) {
				var comp = this;
				if (e.detail && typeof e.detail.newValue != 'undefined') {
					this.value = e.detail.newValue;
				} else {
					this.value = this.fieldElement != null ? this.fieldElement.value : "";
				}
			},
			/**
			 * Triggered on change of an observed HTML attribute
			 * @event attributeChange 
			 */
			attributeChange: function (e) {
				var attributeName = e.detail.attributeName;
				if (attributeName == 'name' && this.getAttribute('name') != this.name) {
					this.name = this.getAttribute('name');
				}
				if (attributeName == 'value' && this.getAttribute('value') != this.value) {
					this.value = this.getAttribute('value');
				}
				if (attributeName == 'view' || attributeName == 'type' || attributeName == 'value' || attributeName == 'label') {
					if (!this.isRendered) { return; }
					if (this.blockAttrRender) { this.blockAttrRender = false; return; }
					if (this.blockAttrRenderAlways) { return; }
					this.waitAndRender();
				}
			}
		},
		properties: {
			value: {
				set: function (newValue) {
					this.setValue(newValue);
				},
				get: function () {
					return this.getValue();
				}
			},
			name: {
				set: function (newValue) {
					this.setName(newValue);
				},
				get: function () {
					return this.getName();
				}
			}
		}
	}
	/**
	 * @constructor
	 */
	zs.fieldElement = zs.customElement(HTMLParagraphElement, 'zs-field', 'p', [zs.validation, zs.clear, zs.field]);

	return zs;
})(window.zs || {});