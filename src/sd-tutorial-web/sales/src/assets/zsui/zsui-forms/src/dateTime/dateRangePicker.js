(function (zs) {
    "use strict";

    /**
     * Date Range pickers are generally used to capture start and end date values as a range from a calendar.
     * @memberof zs
     * @namespace {object} dateRangePicker
     */
    zs.dateRangePicker = {

        // this is to set defaults for synchronized properties see zs.syncPropAttr

        /**
         * Start value of the selected range in MM-YYYY format. Reflects start-range attribute. Should have string values. For example, it's value should be 08-2018 for range staring from August,2018.
         * @type {string}
         * @name startRange
         * @memberof zs.dateRangePicker
         */
        _startRange: '',

        /**
         * End value of the selected range in MM-YYYY format. Reflects end-range attribute. Should have string values. For example, it's value should be 08-2019 for range ending at August,2019
         * @type {string}
         * @name endRange
         * @memberof zs.dateRangePicker
         */
        _endRange: '',

        /**
         * Minimum value that a range could have in MM-YYYY format. Dates beyond this value are not selectable from calendar. Reflects min-range attribute. Should have string values. For example, it's value should be 08-2017 for setting minimum range from August,2017.
         * @type {string}
         * @name minRange
         * @memberof zs.dateRangePicker
         */
        _minRange: '01-' + new Date().getFullYear(),

        /**
         * Maximum value that a range could have in MM-YYYY format. Dates beyond this value are not selectable from calendar. Reflects max-range attribute. Should have string values. For example, it's value should be 08-2020 for setting maximum range to August,2020.
         * @type {string}
         * @name maxRange
         * @memberof zs.dateRangePicker
         */
        _maxRange: '12-' + (new Date().getFullYear() + 1),

        /**
         * Sets locale in which the months should be rendered on calendar. Reflects locale attribute. Should have string values. For example, it's value should be "fr" for setting locale to French.
         * @type {string}
         * @name locale
         * @memberof zs.dateRangePicker
         */
        _locale: "en",

        /**
         * Stores text to be displayed on calendar for each month. Generated as per chosen locale.
         * @type {String[]}
         * @name locale
         * @memberof zs.dateRangePicker
         */
        months: [],

        /**
         * List of attributes to be listened
         * @private
         * @type {String[]}
         */
        observedAttributes: ['start-range', 'end-range', 'min-range', 'max-range', 'locale'],

        /**
         * @type {Boolean}
         * @private
         * Specifies if range calendar should be appended to body
         */
        _attachToBody: true,

        /**
         * Reference to range field element
         * @type {HTMLElement}
         */
        fieldElement: null,

        /**
         * Reference to element containing range calendar
         * @type {HTMLElement}
         */
        rangeContainer: null,

        /**
         * Renders date range field element and calendar
         * @chainable
         * @param {Boolean} cleanUp Performs fresh render after cleaning up element first.
         * @returns {zs.dateRangePicker}
         */
        render: function (cleanUp) {
            var self = this;

            if (cleanUp == true) {
                this.cleanUp(); //Cleanup calendar only if explicitly specified
            }

            // Create field container
            if (!this.fieldContainer) {
                this.fieldContainer = this.querySelector('span.zs-input-icon');

                if (!this.fieldContainer) {
                    this.fieldContainer = document.createElement('span');
                    this.fieldContainer.classList.add("zs-input-icon");
                    this.appendChild(this.fieldContainer);
                }
            }

            if (!this.fieldElement) {

                //Render input field
                this.fieldElement = this.querySelector('input[type="text"]');

                if (!this.fieldElement) {
                    this.fieldElement = document.createElement('input');
                    this.fieldElement.setAttribute('type', 'text');
                }

                this.fieldElement.setAttribute('class', 'zs-input');
                this.fieldElement.setAttribute('readonly', '');

                // Show range calendar on focus
                this._openCalendar = this._openCalendar || this.openCalendar.bind(this);
                this.fieldElement.addEventListener("focus", this._openCalendar);
                this.updateFieldText();

                this.fieldContainer.appendChild(this.fieldElement);
            }

            this.renderCalendarIcon();

            // Render months array as per current locale.
            this.generateMonthsArray(this.locale);

            //Render range calendar
            this.renderRangeCalendar();

            //Bind events to calendar
            //this.bindEvents();

            //Handle document click
            if (!this._documentClickListener) {
                this._documentClickListener = this.documentClick.bind(this);
                document.addEventListener("click", this._documentClickListener);
            }

            return this;
        },


        /**
         * Render calendar icon on input field
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        renderCalendarIcon: function () {
            if (!this.calendarIcon) {

                this.calendarIcon = this.querySelector('a.zs-icon-calendar');

                if (!this.calendarIcon) {
                    this.calendarIcon = document.createElement("a");
                    this.calendarIcon.classList.add("zs-icon");
                    this.calendarIcon.classList.add("zs-icon-calendar");

                    this.calendarIcon.addEventListener("click", this._openCalendar);

                    this.fieldContainer.appendChild(this.calendarIcon);
                }
            }
        },


        /**
         * Render range calendar
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        renderRangeCalendar: function () {

            if (!this.rangeContainer) {
                this.rangeContainer = document.createElement("div");
                this.rangeContainer.classList.add("zs-range-calendar");

                document.body.appendChild(this.rangeContainer);

                this.setPosition();
            }

            //this.rangeContainer.innerHTML = "";

            this._setDateWindow();

            this.renderCalendarHeader();
            this.renderCalendarBody();
            this.renderCalendarFooter();

            this.rangeContainer.style.display = "none";

            return this;
        },

        /**
         * Render header of range calendar - Prev/Next Year text and arrows
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        renderCalendarHeader: function () {
            if (!this.rangeContainer) {
                return;
            }

            if (!this.headerContainer) {
                this.headerContainer = document.createElement("header");
                this.headerContainer.innerHTML = "<span class='prev-btn-container'></span><span class='next-btn-container'></span>";
                this.headerContainer.classList.add("zs-clear");

                this.rangeContainer.appendChild(this.headerContainer);

                this.prevBtn = document.createElement('a');
                this.prevBtn.setAttribute("href", "javascript:void(0)");
                this.prevBtn.setAttribute("role", "prev");

                this.prevYearSpan = document.createElement("span");
                this.nextYearSpan = document.createElement("span");

                this.nextBtn = document.createElement('a');
                this.nextBtn.setAttribute("href", "javascript:void(0)");
                this.nextBtn.setAttribute("role", "next");

                this.headerContainer.querySelector(".prev-btn-container").appendChild(this.prevBtn);
                this.headerContainer.querySelector(".next-btn-container").appendChild(this.nextYearSpan);

                this.headerContainer.querySelector(".next-btn-container").appendChild(this.nextBtn);
                this.headerContainer.querySelector(".prev-btn-container").appendChild(this.prevYearSpan);

                this.prevBtn.addEventListener("click", this);

                this.nextBtn.addEventListener("click", this);
            }

            this.prevYearSpan.innerHTML = this.prevYear;
            this.nextYearSpan.innerHTML = this.nextYear;

            if (this.prevYear <= this._parsedMinRange.year) {
                this.prevBtn.setAttribute("disabled", "disabled");
            } else {
                this.prevBtn.removeAttribute("disabled");
            }

            if (this.nextYear >= this._parsedMaxRange.year) {
                this.nextBtn.setAttribute("disabled", "disabled");
            } else {
                this.nextBtn.removeAttribute("disabled");
            }

            return this;
        },

        handleEvent: function (e) {
            // TODO: Adding "onclick" handler throws error while creating custom element. Hence, calling camel-cased "onClick" handler instead.

            var fnName = 'on' + e.type.charAt(0).toUpperCase() + e.type.slice(1);
            if (typeof this[fnName] == "function") {
                this[fnName](e);
            }
        },

        /**
         * Handler for all click events listened using handleEvent pattern
         */
        onClick: function (e) {
            if (e.target == this.prevBtn) {
                this.prevBtnClickHandler(e);
            }

            if (e.target == this.nextBtn) {
                this.nextBtnClickHandler(e);
            }
        },

        /**
         * Handler for previous button click
         * @param {Object} e 
         */
        prevBtnClickHandler: function (e) {
            e.stopPropagation();

            var minRange = this._parsedMinRange;

            if (minRange.year <= (this.prevYear - 1)) {
                this.nextYear = this.prevYear--;

                this.nextBtn.removeAttribute("disabled");
            }

            if (this.prevYear <= minRange.year) {
                this.prevBtn.setAttribute("disabled", "disabled");
            }

            this.prevYearSpan.innerHTML = this.prevYear;
            this.nextYearSpan.innerHTML = this.nextYear;

            this.renderCalendarBody();
        },
        
        /**
         * Handler for next button click
         * @param {Object} e 
         */
        nextBtnClickHandler: function (e) {
            e.stopPropagation();

            var maxRange = this._parsedMaxRange;

            if (maxRange.year >= (this.nextYear + 1)) {
                this.prevYear = this.nextYear++;
                this.prevBtn.removeAttribute("disabled");
            }

            if (this.nextYear >= maxRange.year) {
                this.nextBtn.setAttribute("disabled", "disabled");
            }

            this.prevYearSpan.innerHTML = this.prevYear;
            this.nextYearSpan.innerHTML = this.nextYear;

            this.renderCalendarBody();
        },

        /**
         * Render body of range calendar - Months for repective Prev/Next Years
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        renderCalendarBody: function () {
            if (!this.rangeContainer) {
                return;
            }

            var prevTableHtml = '<tbody>';
            var nextTableHtml = '<tbody>';

            var prevYear = this.prevYear;

            var nextYear = this.nextYear;

            var startRange = this.startRange && this.startRange.length ? this._parsedStartRange : { month: 9999, year: 9999 };
            var endRange = this.endRange && this.endRange.length ? this._parsedEndRange : { month: -9999, year: -9999 };

            var minRange = this._parsedMinRange;
            var maxRange = this._parsedMaxRange;

            for (var i = 0; i < 3; i++) {
                prevTableHtml += '<tr>';
                for (var j = 0; j < 4; j++) {
                    var month = (i * 4 + j);
                    //if (month >= startRange.month && prevYear >= startRange.year && month <= endRange.month && prevYear <= endRange.year) {
                    if ((new Date(prevYear, month) >= new Date(startRange.year, startRange.month - 1)) && (new Date(prevYear, month) <= new Date(endRange.year, endRange.month - 1)) && (new Date(prevYear, month) >= new Date(minRange.year, minRange.month - 1))) {
                        // Selected month
                        prevTableHtml += '<td current date="' + (month + 1) + '-' + prevYear + '">' + this.months[month] + '</td > ';
                    } //else if (((month + 1 < minRange.month) && (prevYear <= minRange.year)) || ((month + 1 > maxRange.month) && (prevYear >= maxRange.year))) {
                    else if ((new Date(prevYear, month) < new Date(minRange.year, minRange.month - 1)) || (new Date(prevYear, month) > new Date(maxRange.year, maxRange.month - 1))) {
                        // Disabled month
                        prevTableHtml += '<td disabled date="' + (month + 1) + '-' + prevYear + '">' + this.months[month] + '</td > ';
                    } else {
                        prevTableHtml += '<td date="' + (month + 1) + '-' + prevYear + '">' + this.months[month] + '</td > ';
                    }
                }
                prevTableHtml += '</tr>';
            }

            for (var i = 0; i < 3; i++) {
                nextTableHtml += '<tr>';
                for (var j = 0; j < 4; j++) {
                    var month = (i * 4 + j);
                    if ((new Date(nextYear, month) >= new Date(startRange.year, startRange.month - 1)) && (new Date(nextYear, month) <= new Date(endRange.year, endRange.month - 1)) && (new Date(nextYear, month) <= new Date(maxRange.year, maxRange.month - 1))) {
                        // Selected month
                        nextTableHtml += '<td current date="' + (month + 1) + '-' + nextYear + '">' + this.months[month] + '</td > ';
                    } //else if (((month + 1 < minRange.month) && (nextYear <= minRange.year)) || ((month + 1 > maxRange.month) && (nextYear >= maxRange.year))) {
                    else if ((new Date(nextYear, month) < new Date(minRange.year, minRange.month - 1)) || (new Date(nextYear, month) > new Date(maxRange.year, maxRange.month - 1))) {
                        // Disabled month
                        nextTableHtml += '<td disabled date="' + (month + 1) + '-' + nextYear + '">' + this.months[month] + '</td > ';
                    } else {
                        nextTableHtml += '<td date="' + (month + 1) + '-' + nextYear + '">' + this.months[month] + '</td > ';
                    }
                }
                nextTableHtml += '</tr>';
            }

            prevTableHtml += '</tbody>';
            nextTableHtml += '</tbody>';

            if (!this.prevTable) {
                this.prevTable = document.createElement("table");
            }
            if (!this.nextTable) {
                this.nextTable = document.createElement("table");
            }

            if (!this.tableContainer) {
                this.tableContainer = document.createElement("section");
                this.tableContainer.classList.add("months-container");

                this.tableContainer.appendChild(this.prevTable);
                this.tableContainer.appendChild(this.nextTable);

                this.rangeContainer.appendChild(this.tableContainer);
            } else {
                // Unbind cell click handlers for previously generated tables
                this._unbindCellClickEvent();

                this.prevTable.innerHTML = "";
                this.nextTable.innerHTML = "";
            }


            this.prevTable.innerHTML = prevTableHtml;
            this.nextTable.innerHTML = nextTableHtml;

            this._bindCellClickEvent();

        },

        /**
         * Renders footer of range calendar - Clear button
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        renderCalendarFooter: function () {
            var self = this;

            if (!this.rangeContainer) {
                return;
            }

            if (!this.footer) {
                this.footer = document.createElement("footer");
                this.footer.classList.add("clear-container");

                this.clearBtn = document.createElement("a");
                this.clearBtn.innerHTML = "Clear";

                this.clearBtn.addEventListener("click", function () {
                    self.startRange = "";
                    self.endRange = "";
                    self._isFirstClick = false;
                });

                this.footer.appendChild(this.clearBtn);

                this.rangeContainer.appendChild(this.footer);
            }
        },

        /**
        * Generate months to be displayed on calendar based upon set locale
        * @chainable
        * @returns {zs.dateRangePicker}
        */
        generateMonthsArray: function (locale) {
            locale = locale || "en";

            this.months = [];

            for (var i = 0; i < 12; i++) {
                try {
                    this.months.push(new Date(2018, i).toLocaleString(locale, { month: "short" }));
                } catch (e) {
                    console.log(e);
                }
            }
            return this;
        },

        /**
         * Sets the position of calendar container so that it appears exactly below field element when opened.
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        setPosition: function () {
            if (this._attachToBody) {

                var rect = this.fieldElement.getBoundingClientRect();

                //this.rangeContainer.style.width = this.fieldContainer.offsetWidth + 'px';
                this.rangeContainer.style.top = rect.top + rect.height + window.pageYOffset + 'px';
                this.rangeContainer.style.left = rect.left + window.pageXOffset + 'px';


            } else {
                this.fieldContainer.appendChild(this.rangeContainer);
            }

            return this;
        },

        /**
         * Opens range calendar when field element is focused/clicked. Dispatches "beforeOpen", "open" events.
         */
        openCalendar: function (e) {

            e.stopPropagation();

            var self = this;

            self._setDateWindow();

            // Dispatch "beforeopen" event
            self.dispatchEvent(new CustomEvent("beforeOpen"));

            self.renderCalendarHeader();
            self.renderCalendarBody();

            self.oldRange = {
                startDate: self._parsedStartRange,
                endDate: self._parsedEndRange
            }


            self.rangeContainer.style.display = "block";
            self.setPosition();

            // Dispatch "open" event
            self.dispatchEvent(new CustomEvent("open"));

        },


        /**
         * Closes calendar and dispatches "beforeClose", "close" and "change" events
         */
        closeCalendar: function () {

            if (!this.rangeContainer) {
                return
            }
            if (this.rangeContainer.style.display == "none") {
                return
            }
            // Dispatch "beforeclose" event
            this.dispatchEvent(new CustomEvent("beforeClose"));

            var newRange = {
                startDate: this._parsedStartRange,
                endDate: this._parsedEndRange
            }

            var oldRange = this.oldRange;

            if (oldRange) {
                if (!(newRange.startDate.month == oldRange.startDate.month && newRange.startDate.year == oldRange.startDate.year && newRange.endDate.month == oldRange.endDate.month && newRange.endDate.year == oldRange.endDate.year)) {
                    // Dispatch "change" event if new range if different from old range
                    this.dispatchEvent(new CustomEvent("change", {
                        detail: {
                            newRange: newRange,
                            oldRange: oldRange
                        }
                    }));
                }
            }

            this.rangeContainer.style.display = "none";

            this._isFirstClick = false;

            // Dispatch "close" event
            this.dispatchEvent(new CustomEvent("close"));
        },


        /**
         * Helper to convert start/end/min/max-ranges from string to object
         * @private
         */
        _getParsedDate: function (date) {
            if (!date.length) {
                return { month: "", year: "" };
            }

            var dateArr = date.split("-");
            if (dateArr.length == 2) {
                return { month: parseInt(dateArr[0]), year: parseInt(dateArr[1]) };
            } else {
                console.error("Cannot parse date : ", date);
                return { month: "", year: "" };
            }
        },

        /**
         * Sets prev and next years as per selected date range for calendar which is about to get displayed.
         * @private
         */
        _setDateWindow: function (updateYears) {
            if (this._parsedMaxRange == undefined) {
                this._parsedMaxRange = this._getParsedDate(this.maxRange);
            }

            if (this._parsedMinRange == undefined) {
                this._parsedMinRange = this._getParsedDate(this.minRange);
            }

            if (this._parsedEndRange == undefined) {
                this._parsedEndRange = this._getParsedDate(this.endRange);
            }
            if (this._parsedStartRange == undefined) {
                this._parsedStartRange = this._getParsedDate(this.startRange);
            }

            var maxRange = this.maxRange && this.maxRange.length && this._parsedMaxRange;
            var minRange = this.minRange && this.minRange.length && this._parsedMinRange;
            var startRange = this.startRange && this.startRange.length && this._parsedStartRange;

            var endRange = this.endRange && this.endRange.length && this._parsedEndRange;

            if (updateYears == false) {
                return;
            }

            if (minRange.year > startRange.year) {
                this.minRange = "01-" + startRange.year;
            }

            if (maxRange.year < endRange.year) {
                this.maxRange = "12-" + endRange.year;
            }

            if (startRange.year < maxRange.year) {
                this.prevYear = startRange.year;
                this.nextYear = this.prevYear + 1;
            } else if (startRange.year == maxRange.year) {
                this.nextYear = startRange.year;
                this.prevYear = this.nextYear - 1;
            } else if (maxRange.year > new Date().getFullYear() + 1) {
                this.nextYear = new Date().getFullYear() + 1;
                this.prevYear = this.nextYear - 1;
            } else {
                this.nextYear = maxRange.year;
                this.prevYear = this.nextYear - 1;
            }
        },

        /**
         * Binds click event to table cells displaying months
         * @private
         */
        _bindCellClickEvent: function () {
            if (!this.prevTable || !this.nextTable) {
                return;
            }

            var cells = this.rangeContainer.querySelectorAll("table>tbody tr td:not([disabled])");
            var self = this;
            self._isFirstClick = self._isFirstClick ? self._isFirstClick : false;

            this._cellClickHandler = function (e) {
                var cell = e.target;
                e.stopPropagation();

                self._isFirstClick = self._isFirstClick ? false : true;

                if (self._isFirstClick) {
                    self.startRange = cell.getAttribute("date");
                    self.endRange = self.startRange;
                } else {
                    var startRange = self._parsedStartRange;
                    var endRange = self._getParsedDate(cell.getAttribute("date"));

                    if (new Date(startRange.year, startRange.month) > new Date(endRange.year, endRange.month)) {
                        console.warn("End Date cannot be before selected Start Date in calendar. Swapping values");
                        endRange = self.startRange;
                        self.startRange = cell.getAttribute("date");
                        self.endRange = "";
                        self.endRange = endRange;
                    } else {
                        self.endRange = cell.getAttribute("date");
                    }
                }
            }

            for (var i = 0; i < cells.length; i++) {
                cells[i].addEventListener("click", this._cellClickHandler);
            }

        },
        /**
         * Unbind click event to table cells displaying months
         * @private
         */
        _unbindCellClickEvent: function () {
            if (!this._cellClickHandler) {
                return;
            }

            var cells = this.tableContainer.querySelectorAll("table>tbody tr td");

            for (var i = 0; i < cells.length; i++) {
                cells[i].removeEventListener("click", this._cellClickHandler);
            }
        },

        /**
         * Handles document click - closes calendar if click arises from elements outside calendar
         * @private
         */
        documentClick: function (e) {
            if (e.target == this.fieldElement) {
                return;
            }

            if (this.rangeContainer.contains(e.target)) {
                return;
            }

            this.closeCalendar();

        },

        /**
         * Validates range values selected by user. Could be overridden by the consumer.
         */
        validate: function () {
            if (!this.startRange.length && !this.endRange.length) {
                console.warn("Empty start and end dates");
                return false;
            }

            return true;
        },

        /**
         * Returns date range selected by user in an object. Could be overridden by the consumer.
         * @returns {Object}
         */
        getSelectedRange: function () {
            return {
                startDate: this._parsedStartRange,
                endDate: this._parsedEndRange
            }
        },

        /**
         * Updates text displayed on input field element as per set range. Could be overridden by the consumer.
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        updateFieldText: function () {
            if (!this.fieldElement) {
                return this;
            }

            if (!this.startRange && !this.endRange) {
                this.fieldElement.value = "";
                return this;
            }

            var startRange = this._parsedStartRange;
            var endRange = this._parsedEndRange;

            if (!this.months.length) {
                this.generateMonthsArray(this.locale);
            }

            var text = this.months[startRange.month - 1] + " " + startRange.year + " - " + this.months[endRange.month - 1] + " " + endRange.year;

            this.fieldElement.value = text;

            return this;
        },

        /**
         * Cleans up element, usually before render and detach
         * @chainable
         * @returns {zs.dateRangePicker}
         */
        cleanUp: function () {
            document.removeEventListener("click", this._documentClickListener);

            this._documentClickListener = null;
            this._openCalendar = null;

            this.calendarIcon = null;

            if (this.rangeContainer && this.rangeContainer.parentElement) {
                this.rangeContainer.parentElement.removeChild(this.rangeContainer);
            }

            this.rangeContainer = null;

            this.fieldContainer = null;
            this.fieldElement = null;

            this.nextTable = null;
            this.prevTable = null;

            this.clearBtn = null;

            this.prevBtn && this.prevBtn.removeEventListener('click', this);
            this.nextBtn && this.nextBtn.removeEventListener('click', this);

            this.prevBtn = null;
            this.nextBtn = null;

            this.prevYear = null;
            this.nextYear = null;

            this._isFirstClick = null;

            this.headerContainer = null;
            this.footer = null;
            this.tableContainer = null;

            this.innerHTML = "";

            return this;
        },

        /**
         * Events list
         */
        events: {
            create: function () {
                var self = this;

                // Create a property for each observed attribute
                self.syncObservedAttr({
                    "min-range": {
                        type: "string",
                        "onChange": function (name, newValue, oldValue) {
                            if (newValue !== oldValue) {

                                if (this.minRange.length) {
                                    this._parsedMinRange = this._getParsedDate(this.minRange);
                                }

                                self._setDateWindow();

                                self.renderCalendarHeader();
                                self.renderCalendarBody();
                            }
                        }
                    },
                    "max-range": {
                        type: "string",
                        "onChange": function (name, newValue, oldValue) {
                            if (newValue !== oldValue) {

                                if (this.maxRange.length) {
                                    this._parsedMaxRange = this._getParsedDate(this.maxRange);
                                }

                                self._setDateWindow();

                                self.renderCalendarHeader();
                                self.renderCalendarBody();
                            }
                        }
                    },
                    "start-range": {
                        type: "string",
                        "onChange": function (name, newValue, oldValue) {
                            if (newValue !== oldValue) {

                                if (this.startRange.length) {
                                    this._parsedStartRange = this._getParsedDate(this.startRange);
                                }

                                self._setDateWindow(false);

                                self.renderCalendarHeader();

                                this.renderCalendarBody();

                                this.updateFieldText();
                            }
                        }
                    },
                    "end-range": {
                        type: "string",
                        "onChange": function (name, newValue, oldValue) {
                            if (newValue !== oldValue) {

                                if (this.endRange.length) {
                                    this._parsedEndRange = this._getParsedDate(this.endRange);
                                }


                                self._setDateWindow(false);

                                self.renderCalendarHeader();

                                this.renderCalendarBody();

                                // Perform validation after end range is set.
                                this.validate();

                                // Update text displayed on field
                                this.updateFieldText();
                            }
                        }
                    },
                    "locale": {
                        type: "string",
                        "onChange": function (name, newValue, oldValue) {
                            if (newValue !== oldValue) {
                                this.render();
                            }
                        }
                    }
                });
            },

            attach: function () {
                var self = this;

                window.requestAnimationFrame(function () {
                    self.render()
                });
            },

            detach: function () {
                this.cleanUp();
            }
        }
    };

    /**
     * date range picker element
     * @constructor
     * @memberof zs
     * @mixes zs.syncPropAttr
     * @mixes zs.dateRangePicker
     * @extends HTMLElement
     * @extends zs.dateRangePicker
     */
    zs.dateRangePickerElement = zs.customElement(HTMLElement, 'zs-date-range-picker', null, [zs.syncPropAttr, zs.dateRangePicker]);

    return zs;
})(window.zs || {});
