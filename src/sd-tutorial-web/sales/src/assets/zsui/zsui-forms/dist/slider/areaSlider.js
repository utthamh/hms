var zs = (function (zs) {
	'use strict';

	/**
	 * 2d slider behavior. 
	 * @memberof zs
	 * @mixin
	 * @namespace {object} areaSlider
	 */
	zs.areaSlider = {

		/**
		 * Slide x-axis value. Reflects x-value attribute. Should have integer values normally.
		 * @type {number}
		 * @name xValue
		 * @memberof zs.areaSlider
		 */

 		/**
		 * Slide y-axis value. Reflects y-value attribute. Should have integer values normally.
		 * @type {number}
		 * @memberof zs.areaSlider
		 */

		/**
		 * Slide x-axis minimum value. Reflects x-min attribute. Should have integer values normally.
		 * @type {number}
		 * @name xMin
		 * @memberof zs.areaSlider
		 */

 		/**
		 * Slide x-axis maximum value. Reflects x-max attribute. Should have integer values normally.
		 * @type {number}
		 * @name xMax
		 * @memberof zs.areaSlider
		 */

 		/**
		 * Slide y-axis min value. Reflects y-min attribute. Should have integer values normally.
		 * @type {number}
		 * @name yMin
		 * @memberof zs.areaSlider
		 */

		/**
		 * Slide y-axis max value. Reflects x-max attribute. Should have integer values normally.
		 * @type {number}
		 * @name yMax
		 * @memberof zs.areaSlider
		 */


		// this is to set defaults for synchronized properties see zs.syncPropAttr
		_xValue: 0,
		_yValue: 0,
		_xMin: 0,
		_xMax: 100,
		_yMin: 0,
		_yMax: 100,
		observedAttributes: ['x-value', 'y-value', 'x-min', 'x-max', 'y-min', 'y-max'],
		
		/**
		 * If user dragging or touching
		 * @type {boolean} 
		 */
		isDragging: false,

		/**
		 * Last mouse or touch horizontal position relative to the slider element
		 * @type {number}
		 */
		mouseX: null,


		/**
		 * Last mouse or touch vertical position relative to the slider element
		 * @type {number}
		 */
		mouseY: null,		

		/**
		 * Render a handle of the slider
		 * @returns {HTMLElement|string} HTML or an element representing a handle of the slider
		 */
		renderHandle: function () {
			return '<a href="javascript:;" handle style="position:absolute" class="zs-button zs-button-action"></a>';
		},

		/**
		 * Render slider 
		 */
		render: function () {
			var $this = $(this);
			var $handle = $this.find('[handle]');
			
			if (!$handle.length) {
				$this.append(this.renderHandle());				
				$handle = $this.find('[handle]');
				$handle.on('keyup',function(e) {
					// bubble event
					var e1 = $.Event('keyup');
					e1.keyCode = e.keyCode;
					e1.shiftKey = e.shiftKey;
					$this.trigger(e1);
				});
			}
			
			var w = $this.width();
			var h = $this.height();

			var hw = $handle.width();
			var hh = $handle.height();
			var left =  w * this.xValue / (this.xMax - this.xMin);
			var top =h * this.yValue / (this.yMax - this.yMin);
			$handle.css({ 'top': this.fixNumber(top - hh/2), 'left': this.fixNumber(left - hw/2) });
		},

		/**
		 * Fix floating point precision
		 * @param {number} n Number to fix
		 */
		fixNumber: function(n) { 
			return Math.round(n * 1e12) / 1e12;
		},

		/**
		 * Change the way we set properties for slider in order to handle boundaries.
		 * @param {*} name 
		 * @param {*} newValue 
		 * @param {*} onChange 
		 * @override
		 * @see zs.syncPropAttr.propertySet
		 */
		propertySet: function (name, newValue, onChange) {
			if (name == 'xValue' || name == 'yValue') {			
				var lower = name == 'xValue' ? this.xMin : this.yMin;
				var upper = name == 'xValue' ? this.xMax : this.yMax;
				if (newValue < lower) {newValue = lower;}
				if (newValue > upper) {newValue = upper;}
			}
			zs.syncPropAttr.propertySet.apply(this, [name, newValue, onChange]);
		},

		/**
		 * When we change the slider axis values
		 * @param {*} x 
		 * @param {*} y 
		 */
		update: function(x, y) {
			this.xValue = this.fixNumber(x);
			this.yValue = this.fixNumber(y);
		},

		/**
		 * Called after we throttle mouse or touch move events
		 */
		moved: function() {
			var $this = $(this);
			var w = $this.width();
			var h = $this.height();
			var x = Math.round(this.mouseX *(this.xMax - this.xMin) / w);
			var y = Math.round(this.mouseY *(this.yMax - this.yMin) / h);
			this.update(x, y);
			
			$(this).find('[handle]').focus();
			this.moveWaitInterval = null;
		},

		/**
		 * A unified handler for mouse and touch move events
		 * @param {object} e Event object
		 */
		move: function (e) {
			if (this.isDragging) {
			
				var rect = e.currentTarget.getBoundingClientRect();
				var offset = $(this).offset();
				this.mouseX = e.pageX - offset.left,
				this.mouseY = e.pageY - offset.top;
				if (!this.moveWaitInterval) {
					this.moveWaitInterval = window.requestAnimationFrame(this.moved.bind(this));
				}
			}
		},

		/**
		 * A unified handler for mouse and touch stop events
		 * @param {object} e Event object
		 */
		stop: function (e) {
			if (this.isDragging) {
				this.move(e);
				this.isDragging = false;
			}
		},

		/**
		 * A unified handler for mouse and touch start events
		 * @param {object} e Event object
		 */
		start: function (e) {
			this.isDragging = true;
			
		},

		/**
		 * Change event will be called if one of the axis values of slider will be changed.
		 * @event change 
		 * @memberof zs.areaSlider
		 */

		
		events: {
			selectstart: zs.preventEvent,
			dragstart: zs.preventEvent,
			touchstart: function (e) {
				this.start(e);
			},
			scroll: function(e) {
				// Fix the weird scroll issues when overflow is hidden
				this.scrollLeft = 0;
				this.scrollTop = 0;
			},
			keyup: function(e) {
				var shift = e.shiftKey;
				var left = e.keyCode == '37';
				var up = e.keyCode == '38';
				var down = e.keyCode == '40';
				var right = e.keyCode == '39';
				var dy = 0, dx = 0;
				if (up) {dy = -1 ;}
				if (down) {dy = 1;}
				if (left) {dx = -1;}
				if (right) {dx = 1;}
				if (dy == 0 && dx == 0) {return;}
				var stepX = (this.xMax - this.xMin) / 100;
				var stepY = (this.yMax - this.yMin) / 100;
				if (shift) {stepX *= 10; stepY *= 10;}
				e.stopPropagation();
				e.preventDefault();


				var x = this.xValue || 0;
				var y = this.yValue || 0;				

				x += dx*stepX;
				y += dy*stepY;
				this.update(x,y);
				$(this).find('[handle]').focus();
			},
			mousedown: function (e) {
				this.start(e);
			},
			touchmove: function (e) {
				this.move(e);
				e.preventDefault();
			},
			mousemove: function (e) {
				if (this._leftDragging && e.buttons == 1) { 
					this._leftDragging = false;
					this.start(e);
				}
				this.move(e);
			},
			touchend: function (e) {
				this.stop(e);
			},
			mouseup: function (e) {
				this.stop(e);
			},
			mouseleave: function(e) {
				if (this.isDragging && e.currentTarget == this) {
					this._leftDragging = true;
					this.stop(e);
				}
			},	
			attributeChange: function (event) {
				// Sync property value and attribute value only for observed attributes
				if (this.observedAttributes.indexOf(event.detail.attributeName) >= 0) {
					this.syncAttr(event.detail.attributeName, event.detail.newValue, 'number'); // This is where the type might be changed. string, number, boolean
				}
			},
			create: function () {
				var self = this;
				this.shouldRender = true; // Render on attach

				// Create a property for each observed attribute
				this.observedAttributes.forEach(function (attrName, index) {
					var propName = self.attrToPropName(attrName);
					self.syncProp(propName, function (name, newValue, oldValue) {
						this.shouldRender = true;
						var e = new CustomEvent('change', {
							detail: {
								xValue: self.xValue,
								yValue: self.yValue,
								xMax: self.xMax,
								yMax: self.yMax,
								xMin: self.xMin,
								yMin: self.yMin
							}
						});
						self.dispatchEvent(e);
			
					});
				});
			}
		}
	};

	/**
	 * 2d slider element
	 * @constructor
	 * @memberof zs
	 * @mixes zs.syncPropAttr
	 * @mixes zs.smartRender
	 * @mixes zs.areaSlider
	 * @example <zs-2d-slider x-value="50" y-value="50" x-min="0" x-max="100" y-min="0" y-min="100"></zs-2d-slider>
	 */
	zs.areaSliderElement = zs.customElement(HTMLElement, 'zs-area-slider', null, [zs.syncPropAttr, zs.smartRender, zs.areaSlider, {
		events: {
			create: function () {
				console.log('box slider', 'created');
			},
			attach: function () {
				console.log('box slider', 'attached');
			}
		}
	}]);

	return zs;
})(window.zs || {});