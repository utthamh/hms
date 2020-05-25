/**
 * @deprecated since v3.1.0 and moved to zsui-core module
 * will be deleted in v4.0.0
 */
var zs = (function (zs) {
	'use strict';
	/**
	 * Loading behavior - used for showing spinner over specified target
	 * @namespace 
	 */
	zs.loading = {
		observedAttributes: ['loading'],
		loadingTimer1: null,
		loadingTimer2: null,
		loadingWait1: 200,
		loadingWait2: null,
		loadingOverlay: null,
		/**
		 * Shows element spinner and body-level spinner after specified time interval
		 * @param wait1 {Number} time interval after which spinner will be shown on specified target
		 * @param wait2 {Number} time interval after which spinner will be shown over entire document
		 */
		loadingShow: function (wait1, wait2) {
			var self = this;
			wait1 = wait1 || this.loadingWait1;
			wait2 = wait2 || this.loadingWait2;

			if (wait1 != null) {
				this.loadingTimer1 = setTimeout(this.loadingShowSpinner.bind(this), wait1);
			}

			if (wait2 != null) {
				this.loadingTimer2 = setTimeout(this.loadingShowGlobalSpinner.bind(this), wait2);
			}

		},
		/**
		 * Shows spinner over a specified element
		 */
		loadingShowSpinner: function () {
			if (this.loadingTarget) {
				this.loadingTarget.classList.add('zs-loading');
			} else {
				this.classList.add('zs-loading');
			}
		},
		/**
		 * Shows spinner over entire document
		 */
		loadingShowGlobalSpinner: function () {

			if (!this.loadingOverlay) {
				var overlays = document.querySelectorAll('body>.zs-overlay.zs-loading');
				if (!overlays.length) {
					this.loadingOverlay = document.createElement('div');
					this.loadingOverlay.setAttribute('class', 'zs-overlay zs-loading');
					document.body.appendChild(this.loadingOverlay);
				} else {
					this.loadingOverlay = overlays[0];
				}
			}
			this.loadingHideSpinner();
			this.loadingOverlay.style.display = "block";

		},
		/**
		 * Hides spinner
		 */
		loadingHideSpinner: function () {
			this.classList.remove('zs-loading');
			var elements = this.querySelectorAll('.zs-loading');
			for (var i = 0; i < elements.length; i++) {
				elements[i].classList.remove('zs-loading');
			}
			if (this.loadingOverlay) {
				this.loadingOverlay.style.display = "none";
			}
		},


		/**
		 * Clears loading timers set
		 */

		loadingClearTimers: function () {
			if (this.loadingTimer1) {
				clearTimeout(this.loadingTimer1);
				this.loadingTimer1 = null;
			}
			if (this.loadingTimer2) {
				clearTimeout(this.loadingTimer2);
				this.loadingTimer2 = null;
			}
		},
		/**
		 * Sets loading state and target element
		 * @param value {Boolean} spinner visibility state
		 * @param target {Object} target element
		 */
		loadingSet: function (value, target) {
			this.loadingTarget = target;
			this.isLoading = value;
		},
		/**
		 * Changes loading state
		 * @param value {Boolean}
		 */
		loadingChange: function (value) {
			if (value) {
				this.loadingClearTimers();
				this.loadingHideSpinner();
				this.loadingShow();
			} else {
				this.loadingClearTimers();
				this.loadingHideSpinner();
			}
		},
		events: {
			attach: function () {
				var value = (this.getAttribute('loading') == 'on');
				this.loadingTarget = this;
				if (value) {
					this.loadingChange(value);
				}
			},
			attributeChange: function (e) {
				if (e.detail.attributeName == 'loading') {
					var value = (e.target.getAttribute('loading') == 'on');
					this.loadingChange(value);
				}

			}
		}
	};
	return zs;
})(window.zs || {});