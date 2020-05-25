/*
	 ZSUI Accordion

	* @property {Boolean} isOpen
     * @method openPanel
     * @method closePanel
     * @method barClick
     * @method render
     * @method destroy
     * @method configure
     * @event beforeOpen
     * @event onOpen
     * @event onClose
*/

(function ($) {
	'use strict';
	var defaults = {
		isOpen: false,
		beforeOpen: function () {

		},
		onOpen: function () {

		},
		onClose: function () {

		}
	};
	/**
	 * An accordion is a bar, that when clicked, slides open a panel below with detailed content related to the bar's content.  
	 * @namespace zsAccordion
	 */
	function zsAccordion(options, $container) {
		this.$container = $container;
		this.$bar = $container.find(">.zs-accordion-bar");
		this.$panel = $container.find(">.zs-accordion-panel");

		this.configure(options);
		this.render();
	};

	zsAccordion.prototype.defaults = defaults;
	/**
	 * Opens an accordion panel which shows the content of the specific accordion.
	 * @memberof zsAccordion
	 */
	zsAccordion.prototype.openPanel = function () {
		var self = this;
		//Call beforeOpen function

		if (typeof self.options.beforeOpen == "function") {
			self.options.beforeOpen.call(this);
		}

		//Open Panel
		self.$panel.show();
		self.$expandCollapseIcon.removeClass("zs-icon-expand").addClass("zs-icon-collapse");
		self.options.isOpen = true;

		//Call onOpen function
		if (typeof self.options.onOpen == "function") {
			self.options.onOpen.call(self);
		}
	};
	/**
	 * Closes the accordion panel. 
	 * @memberof zsAccordion
	 */
	zsAccordion.prototype.closePanel = function () {
		var self = this;

		//Close panel
		self.$panel.hide();
		self.$expandCollapseIcon.removeClass("zs-icon-collapse").addClass("zs-icon-expand");
		self.options.isOpen = false;

		//Call onClose function
		if (typeof self.options.onClose == "function") {
			self.options.onClose.call(this);
		}
	};
	/**
	 * Handles the click action on the accordion bar.
	 * @memberof zsAccordion
	 */
	zsAccordion.prototype.barClick = function () {
		var self = this;

		if (self.$panel.is(":visible")) {
			self.closePanel();
		}
		else {
			self.openPanel();
		}
	};
	/**
	 * Renders the accordion component.
	 * @memberof zsAccordion
	 */
	zsAccordion.prototype.render = function () {
		var self = this;

		if (self.options.isOpen == true) {
			self.$expandCollapseIcon = $('<a href="javascript:void(0)" class="expandCollapseIcon zs-icon zs-icon-collapse"></a>');
			self.openPanel();
		} else {
			self.$expandCollapseIcon = $('<a href="javascript:void(0)" class="expandCollapseIcon zs-icon zs-icon-expand"></a>');
			self.closePanel();
		}

		//Add expand-collapse icon
		self.$bar.prepend(self.$expandCollapseIcon);

		self.$bar.on('click', this.barClick.bind(self));
	};
	/**
	 * Destroys or remove the accordion component. 
	 * @memberof zsAccordion
	 */
	zsAccordion.prototype.destroy = function () {
		if (this.$container) {
			this.$container.remove();
		}
	};

	zsAccordion.prototype.update = function () {

	}

	zsAccordion.prototype.configure = function (options) {
		if (options) {
			/**
	     	 * @memberof zsAccordion
	    	 * @property {object}  options - Configuration options
        	 * @property {boolean} options.isOpen - A boolean value that indicates whether the accordion is closed or opened.
       		 * @property {function} options.beforeOpen - A function that handles the actions that a user would want to be occurred before opening the accordion.
        	 * @property {function} options.onOpen - A function that handles the actions that a user would want to be occurred on opening the accordion.
        	 * @property {function} options.onClose - A function that handles the actions that a user would want to be occurred on closing the accordion.
	    	 */
			this.options = options;
		}
	}

	$.fn.zsAccordion = function (opt) {
		// Override mode
		if (this == $.fn) {
			$.extend(zsAccordion.prototype, opt);
			return;
		}
		var options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, zsAccordion.prototype.defaults, opt) : $.extend(true, {}, zsAccordion.prototype.defaults);

		return this.each(function () {
			var plugin = $(this).data('zsAccordion');
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
				$(this).data('zsAccordion', new zsAccordion(options, $(this)));
				return;
			}
		});
	}

}(jQuery));
