var zs = (function (zs) {
	'use strict';

	/**
	 * Behavior for zs-form custom element. Forms are used to solicit user input. They may be an entire page, in a popup or modal, a few or single form elements, or in a table.
	 * @namespace
	 */
	zs.form = {
		getFields: function () {
			return this.querySelectorAll('input,button,select,textarea');
		},
		events: {	// Through events object we can attach hooks to life-cycle methods of an element and other custom or native events
			/**
			 * Triggered when a form is submitted 
			 * @event submit
			 */
			submit: function (e) {
				e.preventDefault();
			}
		}
	}

	// 				 zs.customElement(parentClass,		isWhat,		tag,	behaviors)
	zs.formElement = zs.customElement(HTMLFormElement, 'zs-form', 'form', [zs.form, zs.loading, zs.validation]);

	return zs;
})(window.zs || {});