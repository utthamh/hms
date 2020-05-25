(function ($) {
	'use strict';
	var defaults = {
		render: {
			iconSelector: '[clear]',
			icon: function () {
				return '<a href="javascript:void(0)" class="zs-icon zs-icon-remove" clear></a>';
			}
		}

	};
	/**
	 * zsClear - ZSUI clear jQuery plugin  
	 * @namespace zsClear 
	 */
	function zsClear(options, $container) {
		this.$container = $container;
		this.configure(options);
		this.render();
	};
	/**
	 * Renders clear icon and binds functionality
	 * @memberOf zsClear
	 */
	zsClear.prototype.render = function () {
		if (!this.$icon) { this.$icon = this.$container.find(this.options.iconSelector); }
		if (!this.$icon.length) {
			this.$icon = $(this.options.render.icon());

			this.$input = this.$container.find('>input');


			this.$container.append(this.$icon);

			this.$icon.css({
				position: 'absolute',
				//right: 0,
				display: 'none',

				// Need these to cover a icon behind for input box with an icon like search.
				background: 'white', // TODO: not customizable
				zIndex: 2, // TODO: not reliable


			});

			// Events
			this.showBound = this.show.bind(this);
			this.clickBound = this.click.bind(this);
			this.$input.on('propertychange change click keyup input paste', this.showBound);
			this.$icon.on('click', this.clickBound);
		}
	}
	zsClear.prototype.update = function () {

	}
	/**
	 * Shows clear icon
	 * @memberOf zsClear
	 */
	zsClear.prototype.show = function () {
		if (this.$input.val()) {
			this.$icon.show();
		} else {
			this.$icon.hide();
		}
	}
	/**
	 * Hides clear icon
	 * @memberOf zsClear
	 */
	zsClear.prototype.hide = function () {
		this.$icon.hide();
	}
	/**
	 * Toggles clear icon visibility
	 * @memberOf zsClear
	 */
	zsClear.prototype.toggle = function () {
		if (!this.$icon.is(":visible")) {
			this.$icon.show();
		} else {
			this.$icon.hide();
		}
	}
	/**
	 * Handles click over clear icon
	 * memberOf zsClear
	 */
	zsClear.prototype.click = function (event) {
		this.$input.val('').trigger('change');
		this.$icon.hide();
		if (this.options.events && typeof this.options.events.clear == 'function') {
			this.options.events.clear.apply(this);
		}
	}
	/**
	 * Destroys clear plugin
	 * @memberOf zsClear
	 */
	zsClear.prototype.destroy = function () {
		this.$input.off('propertychange change click keyup input paste', this.showBound);
		this.$icon.off();
		this.$icon.remove();
	}

	zsClear.prototype.configure = function (options) {
		if (options) {
			/**
			 * @memberOf zsClear
			 * @property {object} options - Configurable options
			 * @property {object} options.render - Rendering related options
			 * @property {string} options.render.iconSelector - Specifies selector on which clear functionality is to be attached
			 * @property {function} options.render.icon - Specifies a function that returns markup for clear icon
			 */
			this.options = options;
		}
	}

	$.fn.zsClear = function (opt) {
		// Override mode
		if (this == $.fn) {
			$.extend(zsClear.prototype, opt);
			return;
		}
		var options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, defaults, opt) : $.extend(true, {}, defaults);

		return this.each(function () {
			var plugin = $(this).data('zsClear');
			if (plugin) {
				if ($.type(opt) == 'string') {
					switch (opt) {
						case 'destroy':
							plugin.destroy($(this));
							break;
						case 'show':
							plugin.show();
							break;
						case 'hide':
							plugin.hide();
							break;
						case 'update':
							plugin.update();
							break;
						case 'toggle':
							plugin.toggle();
							break;
					}
				} else {
					plugin.configure($.extend(true, plugin.options, opt));
					plugin.update();
				}
				return;
			}
			if ($.type(opt) != 'string') {
				$(this).data('zsClear', new zsClear(options, $(this)));
				return;
			}
		});
	}

}(jQuery));