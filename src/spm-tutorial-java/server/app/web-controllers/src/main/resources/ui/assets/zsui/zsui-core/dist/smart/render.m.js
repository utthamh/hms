/**
 * Help to handle rendering of elements between creating and attaching to the DOM. You can set "shouldRender" property after creating an element.
 * @exports smartRender
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

export default smartRender;