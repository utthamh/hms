/**
 * ZSUI Drawer 
 * @module drawer
 * @requires animate
 */

var zs = (function (zs) {
	'use strict';

    /**
	 * Drawers are panels with tags user can slide in or out 
	 * @exports zs.drawer
	 * @property open {boolean} Set open or close state of the panel
 	 * @property align {string} Set alignment of the panel "top", "right", "bottom", "left"
	 * @property embeded {boolean} Use to place a panel in the container 		
	 * @memberof drawer
 	 */
	zs.drawer = {
		/** @private */
		_duration: 500,

		/** @private */
		_isRendered: false,

		/** @private */
		_toggleElement: null,

		/** properties */
		_open: false,
		_align: 'top', // top, right, bottom, left
		_embeded: false,
		properties: {
			open: {
				set: function (newValue) {
					var shouldToggle = false;
					if (newValue != this._open && this._isRendered) {
						shouldToggle = true;
					}
					this._open = newValue;
					if (newValue != (this.getAttribute('open') != null)) {
						if (newValue) {
							this.setAttribute('open', '');
						} else {
							this.removeAttribute('open');
						}
					}
					if (shouldToggle) {
						this.toggleDrawer(newValue);
					}
				},
				get: function () {
					return this._open;
				}
			},
			align: {
				set: function (newValue) {
					var shouldRender = false;
					if (newValue != this._align && this._isRendered) {
						shouldRender = true;
					}
					this._align = newValue;
					if (newValue != this.getAttribute('align')) {
						this.setAttribute('align', newValue);
					}
					if (shouldRender) { this.render(); }
				},
				get: function () {
					return this._align;
				}
			},
			embeded: {
				set: function (newValue) {
					var shouldRender = false;
					if (newValue != this._embeded && this._isRendered) {
						shouldRender = true;
					}
					this._embeded = newValue;
					if (newValue != (this.getAttribute('embeded') != null)) {
						if (newValue) {
							this.setAttribute('embeded', '');
						} else {
							this.removeAttribute('embeded');
						}
					}
					if (shouldRender) { this.render(); }
				},
				get: function () {
					return this._embeded;
				}
			}
		},


		/**
		 *  Open or close the drawer
		 * @param {boolean=} open Open or close
		 * @fires toggle 
		 */
		toggleDrawer: function (open) {
			var self = this;
			var transform = '';
			var toggleOpen = open == null ? this.open : open;
			switch (this.align) {
				case 'top':
					if (toggleOpen) {
						transform = 'translateY(0%)';
					} else {
						transform = 'translateY(-100%)';
					}
					break;

				case 'left':
					if (toggleOpen) {
						transform = 'translateX(0%)';
					} else {
						transform = 'translateX(-100%)';
					}
					break;

				case 'right':
					if (toggleOpen) {
						transform = 'translateX(0%)';
					} else {
						transform = 'translateX(100%)';
					}
					break;

				case 'bottom':
					if (toggleOpen) {
						transform = 'translateY(0%)';
					} else {
						transform = 'translateY(100%)';
					}
					break;

			}

			var duration = this._duration || 0;
			if (!this._isRendered) { // Initial open/close
				duration = 0;
			}

			var toggleAnchor = this._toggleElement.querySelector('a');

			if (toggleAnchor && (toggleAnchor.classList.contains("zs-icon-delta-arrow-up") || toggleAnchor.classList.contains("zs-icon-collapse"))) {
				if (toggleOpen) {
					toggleAnchor.classList.remove("zs-icon-delta-arrow-up");
					toggleAnchor.classList.add("zs-icon-collapse");
				} else {
					toggleAnchor.classList.add("zs-icon-delta-arrow-up");
					toggleAnchor.classList.remove("zs-icon-collapse");
				}
			}


			var self = this;
			this.startAnimation('slide', duration, {
				before: {
					transitionProperty: 'transform',
				},
				after: {
					transform: transform
				},
			}).then(function () {
				if (self._isRendered) {
					/**
					* After ending sliding drawer
					* @event toggle
					* @type {object}
					*/
					var event = new CustomEvent('toggle');
					self.dispatchEvent(event);
				}
			});

		},

		/**
		 * Render a tag element to close or open drawer when clicked
		 * @fires beforetoggle
		 */
		renderToggle: function () {
			if (!this._toggleElement) {
				this._toggleElement = this.querySelector('toggle,[role="toggle"],tag');
				if (!this._toggleElement) {
					this._toggleElement = document.createElement('toggle');
					this._toggleElement.innerHTML = '<a href="javascript:;" class="zs-icon zs-icon-large zs-icon-delta-arrow-up"></a>';
				}

				this.appendChild(this._toggleElement);
				var self = this;
				this._toggleElement.addEventListener('click', function () {
					/**
					 * Before starting sliding drawer
					 * @event beforetoggle
					 * @type {object}
					 */
					var event = new CustomEvent('beforetoggle');
					self.dispatchEvent(event);
					self.open = !self.open;
				});
			}
		},

		/**
		 * Render a drawer
		 */
		render: function () {
			console.log('render', this.getAttribute('embeded'), this.embeded);
			if (this.embeded && this.parentElement) {
				if (this.parentElement.position == 'static' || this.parentElement.position == null || this.parentElement.position == '') {
					this.parentElement.style.position = 'relative';
				}
				this.parentElement.style.overflow = 'hidden';
				this.style.position = 'absolute';
				this.style.zIndex = 1;

			}
			this.renderToggle();
			this.toggleDrawer();
			this._isRendered = true;


		},
		observedAttributes: ['align', 'embeded', 'open'],
		events: {
			attach: function (e) {
				var self = this;
				setTimeout(function () {
					self.render();
				}, 0);
			},
			attributeChange: function (e) {
				if (e.detail.attributeName == 'align') {
					this.align = this.getAttribute('align');
				}
				if (e.detail.attributeName == 'embeded') {
					this.embeded = this.getAttribute('embeded') != null;
				}
				if (e.detail.attributeName == 'open') {
					console.log('attr change', 'open', this.getAttribute('open'), e.detail.newValue);
					this.open = this.getAttribute('open') != null;
				}
			}
		}



	};

	/**
	 * Drawer component
	 * @constructor 
	 * @extends HTMLElement
	 * @requires animate 
	 */
	zs.drawerElement = zs.customElement(HTMLElement, 'zs-drawer', null, [zs.drawer, zs.animate]);

	return zs;
})(window.zs || {});