(function ($) {
	'use strict';
	
	var defaults = {
	    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	    value: new Date(),
	    firstDayOfWeek: 0,
	    readOnly: true, 
	    minDate: new Date(1900,1,1),
	    maxDate: new Date((new Date()).getFullYear() + 100, (new Date()).getMonth(), (new Date()).getDate()),
	    stringToDate: function(str) {
	        // !!!  Please be aware that a string parameter might be interpreted as a UTC date. And Browsers might not support some date formats and have issues with dates.					
	        return new Date(str);
	    },		
	    dateToString: function(date) {
	        return date.toLocaleDateString('en-US').replace(/[^ -~]/g,''); // Fix for IE11 based on http://stackoverflow.com/questions/21413757/tolocaledatestring-changes-in-ie11
	    },
	    onHide: function () {
	    },
	    formatDay: function(date) {
	        return date.getDate();	
	    },
	    onShow: function () {
	    },
	    onChange: function () {
	    },
	    $calendarContainer: null, // Optional to place the calendar control inside provided container rather than after the input
	    flippable: false,   //Renders calendar on top of field in case of insufficient space at the bottom of field.
	    hideOnScroll: false //Hides calendar on scrolling the page.
    };
	

	function $isThing($elem) {
		if ($elem && $elem.length) {
			return true;
		}
		return false;
	}

	/**
	 * zsDatePicker - ZSUI calendar jQuery plugin. A date picker is a popup calendar that lets the user select a particular date from a calendar.
	 * @namespace zsDatePicker 
	 */	
	
	function zsDatePicker(options, $input) {
		var self = this;		
		self.$input = $input;
		self.$anchor=$input.siblings("a.zs-icon-calendar")
		this.configure(options);
		this.render();

	};
	/**
	 * Builds and renders calendar
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.render = function () {
	    var self = this;
	    self.$container = $('<div class="zs-calendar" style="display:none"></div>');	    
	    if (self.options.$calendarContainer && self.options.$calendarContainer.length) {
	        self.options.$calendarContainer.append(self.$container);
	    } else {
	        self.$input.after(self.$container);
	    }

	    this.buildCalendar(this.value);
	    this.buildHeader();

	    this.$input.click(function (e) {
	        if (self.$container.is(':visible')) {
	            self.hide();
	        } else {
	            self.show();
	            if (self.options.flippable) {
	                self.calculateFlipPosition();
	            }
	        }
	    });

	    this.$input.change(function (e) {
	        if (self.$container.is(':visible')) {
	            self.getDate();
	            self.showCurrent();
	        }
			
			if (typeof self.options.onChange == 'function') {
	        	self.options.onChange.apply(self);
	   		}
	    });

	    this.clickAnywhere = function (e) {
	        if (e.target == self.$input[0]) {
	            return;
	        }
	        if(e.target===self.$anchor[0]){
	        	if (!self.$container.is(':visible')) {
		            self.show();
		            if (self.options.flippable) {
			            self.calculateFlipPosition();
		            }
		            return;
		        } 
		}
	        if (!self.$container.is(':visible')) {
	            return;
	        }
	        if ($isThing($(e.target).closest('.zs-calendar'))) {
	            return;
	        }
	        self.hide();
	    }

        this.$input.prop('readonly', this.options.readOnly);
        
		//Blur required since IE, Safari show caret cursor on input field when datepicker is configured as readonly.
		this.$input.focus(function () {
        	this.blur();
		});

		//Touchstart added for iPad safari.
		$(document).on("click touchstart", this.clickAnywhere);

		this.isInViewPort = function (bottom) {
		    var viewportBottom = $(window).scrollTop() + $(window).height();
		    return bottom < viewportBottom;
		};

		this.calculateFlipPosition = function() {
	        var containerWidth = self.$container.outerWidth();
	        var containerHeight = self.$container.outerHeight();
	        var fieldPos = self.$input.offset();
	        var bodyScrollPos = $(document).scrollTop();

	        var containerTop;
	        var containerLeft = fieldPos.left - $("body").scrollLeft();

	        self.$parentModal = self.$container.parents('.zs-modal')

	        var inViewPort = this.isInViewPort(fieldPos.top + containerHeight);

	        if (!inViewPort) {
	            containerTop = fieldPos.top - containerHeight - bodyScrollPos;
	        } else {
	            containerTop = fieldPos.top + self.$input.outerHeight() - bodyScrollPos;
	        }

		    /* 
                Remove transform applied to modal temporarily if calendar is rendered inside modal.
                For fixed positioned element, when an ancestor has the transform property set then 
                this ancestor is used as container instead of the viewport. 
                Therefore, offset calculation fails with transform applied.
                https://developer.mozilla.org/en/docs/Web/CSS/position
            */

	        if (self.$parentModal.length && self.$parentModal.css("transform") != "none") {
	            var modalOffset = self.$parentModal.offset();
	            var width = self.$parentModal[0].style.width;

	            if (width) {
	                self.removeModalWidthOnHide = false;
	            } else {
	                self.removeModalWidthOnHide = true;
	                width = self.$parentModal.css('width');
	            }
	            self.$parentModal.css({
	                transform: "none",
	                top: (modalOffset.top - bodyScrollPos) + "px",
	                left: modalOffset.left + "px",
	                width: width
	            });

	            self.removeModalStylesOnHide = true;
	        }

	        self.$container.css({
	            position: "fixed",
	            top: containerTop + "px",
	            left: containerLeft + "px"
	        });
		}

	    // Hide on scroll
	    if (self.options.hideOnScroll) {
	        $(document).on("mousewheel DOMMouseScroll scroll", function (e) {
	            if (!self.$container[0].contains(e.target)) {
	                self.hide();
	            }
	        });
	    }
	}
	/**
	 * Sets calendar month
	 * @param newMonth {Number} Index of month
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.setMonth = function (newMonth) {
	    var newDate,
            newYear = this.displayDate.getFullYear();

	    if (newMonth < 0) {
	        newMonth = 11;
	        newYear--;
	    } else if (newMonth > 11) {
	        newMonth = 0;
	        newYear++;
	    }

	    newDate = new Date(newYear, newMonth, 1);

	    if (this.displayDate.getMonth() != newMonth || this.displayDate.getFullYear() != newYear) {
	        this.buildCalendar(newDate);
	    }

	    this.$container.find('select[name="month"]').val(newMonth);
	    this.$container.find('select[name="year"]').val(newYear);
	}
	/**
	 * Formats day if custom function provided, returns day of month by default
	 * @param date {Object} date object
	 * @returns day of month
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.formatDay = function (date) {
	    if (typeof this.options.formatDay == 'function') {
	        return this.options.formatDay(date);
	    } else {
	        return date.getDate();
	    }
	};
	/**
	 * Builds calendar header
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.buildHeader = function () {
	    var html = '', i, date, year, self = this;
	    if (!$isThing(this.$container)) {
	        return;
	    }

	    html = '<header>';
	    html += '<a href="javascript:void(0)" role="prev" class=""></a>';
	    html += '<span><select name="year">';
	    for (i = this.options.minDate.getFullYear() ; i <= this.options.maxDate.getFullYear() ; i++) {
	        html += '<option value="' + i + '"' + (i == this.displayDate.getFullYear() ? '" selected' : '') + '>' + i + '</option>';
	    }
	    html += '</select></span>';

	    html += '<span><select name="month">';
	    for (i = 0; i < 12; i++) {
	        html += '<option value="' + i + '"' + (i == this.displayDate.getMonth() ? '" selected' : '') + '>' + this.options.months[i] + '</option>';
	    }
	    html += '</select></span>';

	    html += '<a href="javascript:void(0)" role="next"></a>';

	    html += '</header>';
	    this.$container.prepend(html);

	    this.$container.find('[role="prev"]').click(function (e) {
	        self.setMonth(self.displayDate.getMonth() - 1);
	    });

	    this.$container.find('[role="next"]').click(function (e) {
	        self.setMonth(self.displayDate.getMonth() + 1);
	    });

	    this.$container.find('select[name="month"]').on('change', function () {
	        var newMonth, newDate;
	        newMonth = $(this).val();
	        self.displayDate.getFullYear()
	        if (self.displayDate.getMonth() != newMonth) {
	            newDate = new Date(self.displayDate.getFullYear(), newMonth, 1);
	            self.buildCalendar(newDate);
	        }
	    });

	    this.$container.find('select[name="year"]').on('change', function () {
	        var newYear, newDate;
	        newYear = $(this).val();

	        if (self.displayDate.getFullYear() != newYear) {
	            newDate = new Date(newYear, self.displayDate.getMonth(), 1);
	            self.buildCalendar(newDate);
	        }

	    });

	}
	
	/**
	 * Builds entire month's calendar for the date provided
	 * @param date {Object} date object
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.buildCalendar = function (date) {
	    var html = '', startDate, dayShift, self = this;
	    if (!$isThing(this.$container)) {
	        return;
	    }

	    // Set the current base month date 
	    this.displayDate = date;

	    // Start generating the HTML            
	    html = '<tr>';

	    // Weeks
	    var arr = this.options.daysOfWeek.slice(0); // Clone array
	    if (this.options.firstDayOfWeek) {
	        // Shift array to the right
	        var i = 0;
	        while (i < this.options.firstDayOfWeek) {
	            arr.push(arr.shift());
	            i++;
	        }
	    }

	    for (var i = 0; i < 7; i++) {
	        html += '<th>' + arr[i] + '</th>';
	    }

	    html += '</tr><tr>';

	    // Start date and how many days to show from previous month
	    startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	    var month = startDate.getMonth();

	    dayShift = startDate.getDay();
	    dayShift = dayShift == 0 ? -7 : -dayShift-7;
	    dayShift+=this.options.firstDayOfWeek%7;		

	    startDate.setDate(startDate.getDate() + dayShift);
		
	    var endOfWeekDate=new Date(startDate);
	    endOfWeekDate.setDate(endOfWeekDate.getDate()+6);

	    // If entire first week is not in current month, shift start date by a week
	    if(startDate.getMonth() != month && endOfWeekDate.getMonth() != month){
	    	startDate.setDate(startDate.getDate() + 7);
	    }		

	    // Build a days table
	    for (i = 0; i < 42; i++) {

	        if (i % 7 == 0) {
	            html += '</tr><tr>';
	        }
	        html += '<td date="' + startDate.toString() + '"'
                + (startDate.getMonth() != month ? ' notInMonth' : '')
                + (startDate > this.options.maxDate || startDate < this.options.minDate ? ' disabled' : '')
                + '>' + this.formatDay(startDate) + '</td>';
	        startDate.setDate(startDate.getDate() + 1);
	    }

	    // wrap up generating the day picker
	    html = '<table>' + html + '</table>';

	    this.$container.find('table').remove();
	    this.$container.append(html);
	    this.showCurrent();

	    this.$container.find('td').click(function (e) {
	        var newValue = new Date($(this).attr('date'));
	        self.setDate(newValue);
	    });


	    // Disable and enable next and prev buttons
	    var newDate = new Date(this.displayDate.getTime()); // clone display date

	    // Get first date of next  month
	    newDate.setMonth(newDate.getMonth() + 1);
	    newDate.setDate(1);
	    if (this.options.maxDate && this.options.maxDate < newDate) {
	        this.$container.find('[role="next"]').attr('disabled', 'true');
	    } else {
	        this.$container.find('[role="next"]').removeAttr('disabled');
	    }

	    newDate = new Date(this.displayDate.getTime()); // clone display date
	    newDate.setDate(-1); // Get last date of previous month						
	    if (this.options.minDate && this.options.minDate > newDate) {
	        this.$container.find('[role="prev"]').attr('disabled', 'true');
	    } else {
	        this.$container.find('[role="prev"]').removeAttr('disabled');
	    }


	}
	/**
	 * Sets new date to calendar
	 * @param newValue {Object} new date object
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.setDate = function (newValue) {
	    this.value = newValue;
	    this.$input.val(this.dateToString(newValue));
	    if (typeof this.options.onChange == 'function') {
	        this.options.onChange.apply(this);
	    }
	    this.showCurrent();
	    this.hide();
	}

	/**
	 * Gets date value from input box and builds calendar
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.getDate = function () {
	    var str = this.$input.val();
	    if (str) {
	        this.value = this.stringToDate(str);
	    } else {
	        this.value = this.options.value || new Date();
	    }

	    // Set selected year and month
	    this.$container.find('select[name="month"]').val(this.value.getMonth());
	    this.$container.find('select[name="year"]').val(this.value.getFullYear());

	    if (this.displayDate != this.value) {
	        this.buildCalendar(this.value);
	    }
	}

	/**
	 * Hides calendar
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.hide = function () {
	    this.$container.hide();
	    //this.$input.removeAttr('disabled');
	    if (typeof this.options.onHide == 'function') {
	        this.options.onHide.apply(this);
	    }

        if (this.removeModalStylesOnHide) {
            var cssStyle = {
                transform: "",
                top: "",
                left: ""
            };
            if (self.removeModalWidthOnHide) {
                cssStyle.width = "";
            }
            this.$parentModal.css(cssStyle);
        }
	}

	/** 
	 * Shows calendar
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.show = function () {
	    this.getDate();
	    if (this.displayDate != this.value) {
	        this.buildCalendar(this.value);
	    }
	    this.$container.show();
	    //this.$input.attr('disabled', true);
	    if (typeof this.options.onShow == 'function') {
	        this.options.onShow.apply(this);
	    }
	}

	/**
	 * Helper to convert string to Date object
	 * @param str {String} date in string
	 * @returns date object
	 * @memberof zsDatePicker
	 */
	
	zsDatePicker.prototype.stringToDate = function (str) {
	    if (typeof this.options.stringToDate == 'function') {
	        return this.options.stringToDate(str);
	    } else {
	        return new Date(str);
	    }
	}

	/**
	 * Helper to date to string
	 * @param date {Object} date object
	 * @returns date in string
	 * @memberof zsDatePicker
	 */
	
	zsDatePicker.prototype.dateToString = function (date) {
	    if (typeof this.options.dateToString == 'function') {
	        return this.options.dateToString(date);
	    } else {
	        return date.toLocaleDateString('en-US');
	    }
	}

	/**
	 * Highlights today and selected date on calendar
	 * @memberof zsDatePicker
	 */

	zsDatePicker.prototype.showCurrent = function () {
	    var d = new Date();
	    // Today
	    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	    this.$container.find('td[today]').removeAttr('today');
	    this.$container.find('td[date="' + d.toString() + '"]').attr('today', '');
	    // Current
	    this.$container.find('td[current]').removeAttr('current');
	    d = this.value;
	    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	    this.$container.find('td[date="' + d.toString() + '"]').attr('current', '');
	}

	/**
	 * Configures plugin as per options provided
	 * @param opt {Object} options object
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.configure = function (opt) {
		/**
		 * @memberOf zsDatePicker
		 * @property {object} options - Configurable options
		 * @property {array} options.months - Months Array
		 * @property {array} options.daysOfWeek - Days Array
		 * @property {object} options.value - Value of selected date
		 * @property {number} options.firstDayOfWeek - Specifies index of first day to be displayed on calendar
		 * @property {boolean} options.readOnly - Specify if date typing is available
		 * @property {object} options.maxDate - Specifies maximum date to be displayed on calendar
		 * @property {object} options.minDate - Specifies minimum date to be displayed on calendar
		 * @property {function} options.onHide - Callback triggered when calendar is hid 
		 * @property {function} options.onShow - Callback triggered when calendar is shown
		 * @property {function} options.onChange - Callback triggered when calendar date is changed
		 * @property {boolean} options.flippable - Renders calendar on top of field in case of insufficient space at the bottom of field.
		 * @property {boolean} options.hideOnScroll - Hides calendar on scrolling the page.
		 */		
		this.options = opt;
	    if (opt.value) {
	        this.value = new Date(opt.value);
	    } else if (!this.value) {
	        this.value = new Date();
	    }
	}

	/**
	 * Destroys calendar plugin
	 * @memberof zsDatePicker
	 */
	zsDatePicker.prototype.destroy = function () {
	    $(document).off('click', this.clickAnywhere);
	    if (this.$input) {
	        this.$input.removeData('zsDatePicker');
	    }
	    if (this.$container) {
	        this.$container.remove();
	    }
	}
	
	/**
	 * Sets calendar year
	 * @param newYear {Number} year value
	 * @memberof zsDatePicker
	 */

	zsDatePicker.prototype.setYear = function (newYear) {
	    var newDate = new Date(newYear, this.displayDate.getMonth(), 1);
	    if (newDate != this.displayDate) {
	        this.buildCalendar(newDate);
	    }
	    this.$container.find('select[name="year"]').val(newYear);
	}

	/**
	 * Expose defaults on the prototype for overrides  
	 * @memberof zsDatePicker	 	  
	 */
	zsDatePicker.prototype.defaults = defaults;
	
	$.fn.zsDatePicker = function (opt) {
		// Override mode
		if (this == $.fn) {
			$.extend(zsDatePicker.prototype, opt);
			return;
		}	
		
		var options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, defaults, opt) : $.extend(true, {}, defaults);
		
		return this.each(function () {
			var datePicker = $(this).data('zsDatePicker'), $input;
			if (datePicker) {
				if ($.type(opt) == 'string') {
					switch (opt) {
						case 'show':
							$(this).select().focus();
							datePicker.show();
							break;
						case 'hide':
							datePicker.hide();
							break;
						case 'destroy':
							datePicker.destroy($(this));
							break;
					}
				} else {
					datePicker.configure($.extend(true, datePicker.options, opt));
				}
				return;
			}
			if ($.type(opt) != 'string') {
				$(this).data('zsDatePicker', new zsDatePicker(options, $(this)));
				return;
			}
		});
	}


} (jQuery));



