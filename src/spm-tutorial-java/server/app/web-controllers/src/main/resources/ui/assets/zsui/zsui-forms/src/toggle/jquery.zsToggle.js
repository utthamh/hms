(function ($) {
	'use strict';
	var defaults = {
		caption: {
			// captions for the ON/OFF buttons
			on: 'ON',
			off: 'OFF'
		},
		on: true, // is toggle ON at initialization
		// Provide the onClick hook. This can be used to get the current state of the toggle component.
		onClick: function () {
		}
	};
	/**
	 * zsToggle - ZSUI Toggle jQuery plugin. Toggles are used to visually indicate whether or not something is turned on or off. They are frequently found in Settings.
	 * @namespace zsToggle
	 */
	function zsToggle(options, $container) {
		this.$container = $container;
		this.configure(options);
		this.render();
	};

	zsToggle.prototype.defaults = defaults;
	/**
	 * Renders toggle button and bind functionality
	 * @memberOf zsToggle
	 */
	zsToggle.prototype.render = function () {
		var self = this;
		var caption = self.options.caption;
		var toggleContainer = $('<div class="toggle-container">');
		var toggleDiv = $('<div class="zs-toggle">');
		var toggleInnerDiv = $('<div class="toggle-inner">');
		var toggleOn = $('<div class="zs-toggle-on">').html(caption.on + '<div class="text-balancer">' + caption.off + '</div>');
		var toggleButton = $('<div class="zs-toggle-button">');
		var toggleOff = $('<div class="zs-toggle-off">').html(caption.off + '<div class="text-balancer">' + caption.on + '</div>');

		toggleInnerDiv.append(toggleOn, toggleButton, toggleOff);
		toggleDiv.html(toggleInnerDiv);
		toggleContainer.html(toggleDiv);
		self.$container.html(toggleContainer);

		if (typeof self.options.on == 'function') {
			self.isActive = self.options.on.apply(self);
		} else {
			self.isActive = self.options.on;
		}

		toggleInnerDiv.toggleClass('active', self.isActive);

		self.$target = $(toggleContainer);
		self.$target.click(function (e) {
			self.toggle();

			if (typeof self.options.onClick == 'function') {
				return self.options.onClick.call(self, e);
			}
		});

	}

	/**
	 * Destroys zsToggle plugin
	 * @memberOf zsToggle
	 */
	zsToggle.prototype.destroy = function () {
		this.$container.find('.toggle-container').remove();
	};

	/**
	 * Sets the state of the Toggle based on the passed parameter.
	 * @memberOf zsToggle
	 */
	zsToggle.prototype.setState = function (active) {
		var toggleInnerDiv = this.$container.find('.toggle-inner');
		this.isActive = active;
		toggleInnerDiv.toggleClass('active', active);
	}

	/**
	 * Updates toggle component to reflect dynamic changes.
	 * @memberOf zsToggle
	 */
	zsToggle.prototype.update = function () {
		this.setState(this.isActive);
	};

	/**
	 * Toggles active state
	 * @memberOf zsToggle
	 */
	zsToggle.prototype.toggle = function () {
		// Toggle the active state
		this.setState(!this.isActive);
	}

	zsToggle.prototype.configure = function (options) {
		if (options) {
			/**
			 * @memberOf zsToggle 
			 * @property {object} options - Configurable options
			 * @property {object} options.caption - specifies captions for the ON/OFF buttons
			 * @property {string} options.caption.on - specifies caption for ON button
			 * @property {string} options.caption.off - specifies caption for OFF button
			 * @property {boolean} options.on - specifies if toggle ON at initialization
			 * @property {function} options.onClick - onClick hook. Triggers everytime the toggle button is clicked and can be used to get the current state of the toggle component. 
		 	 */
			this.options = options;
		}
	}

	$.fn.zsToggle = function (opt) {
		// Override mode
		if (this == $.fn) {
			$.extend(zsToggle.prototype, opt);
			return;
		}
		var options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, zsToggle.prototype.defaults, opt) : $.extend(true, {}, zsToggle.prototype.defaults);

		return this.each(function () {
			var plugin = $(this).data('zsToggle');
			if (plugin) {
				if ($.type(opt) == 'string') {
					switch (opt) {
						case 'destroy':
							plugin.destroy($(this));
							break;
						case 'update':
							plugin.update();
							break;

					}
				} else {
					plugin.configure($.extend(true, plugin.options, opt));
					plugin.render();
				}
				return;
			}
			if ($.type(opt) != 'string') {
				$(this).data('zsToggle', new zsToggle(options, $(this)));
				return;
			}
		});
	}

}(jQuery));
