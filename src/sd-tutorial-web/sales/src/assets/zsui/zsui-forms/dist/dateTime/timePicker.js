(function (zs) {
    "use strict";

    /**
     * Timepickers are generally used to capture time of the day.
     * @namespace
     */
    zs.timePicker = {

        _ONE_DAY: 86400,

        /**
         * Default params
         * @private
         * @type {Object}
         */
        _defaults: {
            lang: {
                am: 'am',
                pm: 'pm',
                AM: 'AM',
                PM: 'PM',
                decimal: '.',
                mins: 'mins',
                hr: 'hr',
                hrs: 'hrs'
            },
            step: 30,
            format24: false,
            value: "",
            min: "12:00am",
            max: "11.59pm"
        },

        /**
         * @private
         * @type {Boolean}
         * Shows time in 24 hour format if set to true
         */
        _format24: null,

        /**
         * @private
         * @type {Number}
         * Maximum allowable time value
         */
        _max: null,

        /**
         * @private
         * @type {Number}
         * Minimum allowable time value
         */
        _min: null,

        /**
         * @private
         * @type {Number}
         * Time interval in minutes between two list items in time menu
         */
        _step: null,

        /**
         * @private
         * @type {Number} 
         * Stores set time
         */
        _value: null,

        /**
         * @type {Object}
         * Stores language specific translations
         */
        _lang: {
            am: 'am',
            pm: 'pm',
            AM: 'AM',
            PM: 'PM',
            decimal: '.',
            mins: 'mins',
            hr: 'hr',
            hrs: 'hrs'
        },

        /**
         * @type {Boolean}
         * Specifies if time menu should be appended to body
         */
        attachToBody: false,

        /**
         * List of attributes to be listened
         * @private
         * @type {String[]}
         */
        observedAttributes: ['value', 'min', 'max', 'step'],

        /**
         * Reference to time field element
         * @type {HTMLElement}
         */
        fieldElement: null,

        /**
         * Reference to element containing menu items
         * @type {HTMLElement}
         */
        menuContainer: null,

        /**
         * Callback function that is triggered when time value changes         
         */
        onChange: null,

        /**
         * Calculated properties
         * @private
         * @type {Object}
         */
        properties: {
            step: {
                set: function (value) {
                    if (isNaN(value) || ("" + value).trim() === "") {
                        value = this._defaults.step;
                    }

                    if (value > this._ONE_DAY / 60) {
                        value = this._defaults.step;
                    }

                    this._checkAndUpdateAttrByProp('step', value);
                    this._step = value;
                },
                get: function (value) {
                    return this._step;
                }
            },
            format24: {
                set: function (value) {
                    if (!(typeof value == "string" || typeof value == "boolean")) {
                        value = this._defaults.format24;
                    }

                    this._checkAndUpdateAttrByProp('format24', value);
                    this._format24 = value;
                },
                get: function (value) {
                    return this._format24;
                }
            },
            max: {
                set: function (value) {
                    if (isNaN(value) && typeof value == "string" && !(value != "" && this._time2int(value) == null)) {
                        value = this._getFormattedTime(value);
                    } else if (!isNaN(value)) {
                        value = this._int2time(value);
                    } else {
                        value = this._defaults.max;
                    }

                    this._checkAndUpdateAttrByProp('max', value);
                    this._max = value;
                },
                get: function (value) {
                    return this._max;
                }
            },
            min: {
                set: function (value) {
                    if (isNaN(value) && typeof value == "string" && !(value != "" && this._time2int(value) == null)) {
                        value = this._getFormattedTime(value);
                    } else if (!isNaN(value)) {
                        value = this._int2time(value);
                    } else {
                        value = this._defaults.min;
                    }

                    this._checkAndUpdateAttrByProp('min', value);
                    this._min = value;
                },
                get: function (value) {
                    return this._min;
                }
            },

            /**
             * Time value
             * @memberof zs.timePicker
             * @type {String}
             */
            value: {
                set: function (value) {
                    var oldValue = this.value;

                    if (typeof value == "string" && value != "" && this.validate(value)) {
                        value = this._getFormattedTime(value);
                    } else if (value == "") {
                        value = "";
                    } else if (this.value != "" && this.value != null) {
                        value = this.value;
                    } else {
                        value = this._defaults.value;
                    }

                    this._value = value;

                    if (typeof this.onChange == "function" && value != oldValue) {
                        this.onChange();
                    }

                    if (this.fieldElement) {
                        this.fieldElement.value = value;
                    }

                    this._checkAndUpdateAttrByProp('value', value);
                },
                get: function (value) {
                    return this._value;
                }
            },

            lang: {
                set: function (value) {
                    if (!(typeof value == "object")) {
                        value = this._defaults.lang;
                    }


                    this._lang = value;
                },
                get: function (value) {
                    return this._lang;
                }
            }
        },

        /**
         * Set default values to properties
         * @private
         * @returns {zs.timePicker}
         */
        _setDefaults: function () {
            for (var i in this.properties) {
                var value = this._defaults[i];
                if (!this.properties.hasOwnProperty(i)) { // that's even not ours property
                    continue;
                }

                if (this[i] !== null) { // value was already set
                    continue;
                }

                if (this[i] == value) { // this particular value was already set
                    continue;
                }

                this[i] = value;
            }

            return this;
        },

        /**
         * Check if it is necessary to update attribute after 
         * property was changes and if so updates it
         * @private
         * @param {String} name - Name of attribute
         * @param {String} value - Value to be set
         * @returns {zs.timePicker}
         */
        _checkAndUpdateAttrByProp: function (name, value) {
            if (value == this.getAttribute(name)) {
                return this;
            }

            this.setAttribute(name, value);

            if (this._isRendered) {
                this.render();
            }

            return this;
        },

        /**
         * Check if it is necessary to update property after 
         * attribute was changes and if so updates it
         * @private
         * @param {String} name - Name of property
         * @param {String} value - Value to be set
         * @returns {zs.timePicker}
         */
        _checkAndUpdatePropByAttr: function (name, value) {
            if (!this.properties.hasOwnProperty(name)) {
                return this;
            }

            var currentVallue = '' + this[name];
            if (currentVallue == value) {
                return this;
            }

            this[name] = value;

            if (this._isRendered) {
                this.render();
            }

            return this;
        },

        /**
         * Render time field element
         * @chainable
         * @returns {zs.timePicker}
         */
        render: function () {
            var self = this;

            this.cleanUpList(); //Incase of re-render we need to regenerate menu list

            this._setDefaults();

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
                this.fieldElement.setAttribute('value', this.value);

                this.fieldElement.addEventListener("focus", function () {
                    self.menuContainer.style.display = "block";
                    if (self.menuContainer.querySelector("nav [hover]")) {
                        self.menuContainer.querySelector("nav [hover]").scrollIntoView();
                    } else if (self.menuContainer.querySelector("nav [active]")) {
                        self.menuContainer.querySelector("nav [active]").scrollIntoView();
                    }
                });

                this.fieldElement.addEventListener("change", function (e) {
                    self.value = this.value;
                });

                this.fieldElement.addEventListener("input", function (e) {
                    var val = self._getFormattedTime(this.value);

                    if (val != null) {
                        val = self._time2int(val);

                        //Find the list item with nearest deviation to typed value.

                        var list = self.menuContainer.querySelectorAll("nav a");
                        var selectedEl = list[0];
                        for (var i = 0; i < list.length; i++) {
                            if (Math.abs(Number(list[i].getAttribute("value") - val)) <= Math.abs(Number(selectedEl.getAttribute("value") - val))) {
                                selectedEl = list[i];
                            }
                        }

                        if (self.menuContainer.querySelector("[hover]")) {
                            self.menuContainer.querySelector("[hover]").removeAttribute("hover");
                        }

                        //Scroll to selected element
                        selectedEl.setAttribute("hover", "");
                        selectedEl.scrollIntoView();
                    }
                });

                this.fieldContainer.appendChild(this.fieldElement);
            } else {
                this.fieldElement.setAttribute('value', this.value);
            }

            //Render time menu
            this.renderTimeMenu();

            //Bind events to time menu
            this.bindEvents();

            if (!this._isRendered) {
				//Handle document click
				this.documentClickListener = this.documentClick.bind(this);
                document.addEventListener("click", this.documentClickListener);
            }

            this._isRendered = true;

            return this;
        },

        /**
         * Render time menu
         * @chainable
         * @returns {zs.timePicker}
         */
        renderTimeMenu: function () {

            if (!this.menuContainer) {
                this.menuContainer = document.createElement("div");
                this.menuContainer.classList.add("zs-timepicker");
                this.menuContainer.classList.add("zs-menu");
                this.menuContainer.style.position = "absolute";

                if (this.attachToBody) {
                    this.menuContainer.style.width = this.fieldContainer.offsetWidth + 'px';
                    this.menuContainer.style.top = this.offsetTop + this.offsetHeight + 'px';
                    document.body.appendChild(this.menuContainer);
                } else {
                    this.fieldContainer.appendChild(this.menuContainer);
                }
            }

            this.menuContainer.innerHTML = "";
            var nav = document.createElement("nav");
            var aTag = "";

            for (var i = this._time2int(this.min); i <= this._time2int(this.max); i += this.step * 60) {
                if (this.value == this._int2time(i)) {
                    aTag += "<a href='javascript:void(0)' value='" + this._time2int(i) + "' active>" + this._int2time(i) + "</a>";
                } else {
                    aTag += "<a href='javascript:void(0)' value='" + this._time2int(i) + "'>" + this._int2time(i) + "</a>";
                }
            }

            nav.innerHTML = aTag;

            if (!nav.querySelector('[active]')) {
                nav.querySelector("a").setAttribute("active", "");
            }
            this.menuContainer.appendChild(nav);

            return this;
        },

        /**
         * Binds all Events related to component
         */
        bindEvents: function () {
            var listItems = this.menuContainer.querySelectorAll('a');

            for (var i = 0; i < listItems.length; i++) {
                var listItem = listItems[i];
                listItem.addEventListener('click', this.optionClick.bind(this));
            }

            //Handle Up/Down keyUp on nav,input
            this.fieldElement.addEventListener("keyup", this.onKeyUp.bind(this));
            this.menuContainer.querySelector("nav").addEventListener("keyup", this.onKeyUp.bind(this));

            //Handle Enter keyDown on nav,input
            this.fieldElement.addEventListener("keydown", this.onKeyDown.bind(this));
            this.menuContainer.querySelector("nav").addEventListener("keydown", this.onKeyDown.bind(this));
        },

        /**
         * Adds Enter key to select option functionality
         */
        onKeyDown: function (event) {
            if (event.keyCode === 13) {
                var nav = this.menuContainer.querySelector("nav");
                var selected = nav.querySelector("a[hover]");

                if (selected) {
                    if (this.menuContainer.style.display != "none") {
                        this.selectOption(selected);
                        if (this.menuContainer.querySelector("a[active]")) {
                            this.menuContainer.querySelector("a[active]").removeAttribute("[active]");
                        }
                        selected.setAttribute("active", "");
                        this.value = selected.innerText;
                        this.menuContainer.style.display = "none";
                    }
                }
            }
        },

        /**
         * Adds Up/Down arrow key support
         */
        onKeyUp: function (event) {
            switch (event.keyCode) {
                case 9: // Tab
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case 38: // Up
                    event.preventDefault();
                    event.stopPropagation();
                    var nav = this.menuContainer.querySelector("nav");
                    // Get the next option
                    var selected = nav.querySelector("a[hover]");
                    if (!selected) {
                        var prev = nav.lastElementChild;
                    } else {
                        var prev = selected.previousElementSibling;
                    }
                    if (prev) {
                        this.selectOption(prev, true);
                    }
                    break;
                case 40: //Down
                    event.preventDefault();
                    event.stopPropagation();

                    var nav = this.menuContainer.querySelector("nav");
                    var selected = nav.querySelector("a[hover]");

                    if (!selected) {
                        var next = nav.firstElementChild;
                    } else {
                        var next = selected.nextElementSibling
                    }
                    if (next) {
                        this.selectOption(next, true);
                    }
                    break;
            }
        },

        /**
         * Selects and option during up/down arrow press
         * @param a {HTMLElement} - Element to be selected.
         * @param scrollTo {Boolean} - Specifies whether to scroll the menu to selected element.
         */
        selectOption: function (a, scrollTo) {
            if (this.menuContainer.querySelector("nav a[hover]")) {
                this.menuContainer.querySelector("nav a[hover]").removeAttribute('hover');
            }

            if (a) {
                a.setAttribute("hover", "");

                // Scroll to the element
                if (window.navigator && window.navigator.userAgent && window.navigator.userAgent.match(/iPad/i)) { // avoid keyboard changing on ipad
                    return;
                }

                if (scrollTo) {
                    a.scrollIntoView();
                }
            }
        },

        /**
         * Handles menu item click 
         */
        optionClick: function (e) {
            var active = this.menuContainer.querySelector("[active]");
            if (active) {
                active.removeAttribute("attr");
            }
            e.target.setAttribute("active", "");
            this.value = e.target.innerText;
            this.menuContainer.style.display = "none";
            e.stopPropagation();
        },

        /**
         * Handles document click
         */
        documentClick: function (e) {
            if (e.target == this.fieldElement) {
                return;
            }
            this.menuContainer.style.display = "none";
        },

        /**
         * Validates time values entered by user         
         */
        validate: function (value) {
            if (value != "" && this._time2int(value) == null) {
                return false;
            }
            if (this.max && this.min && !(this._time2int(value) >= this._time2int(this.min) && this._time2int(value) <= this._time2int(this.max))) {
                console.log("Entered time should be between min and max range");
                return false;
            }
            return true;
        },

        /**
         * Cleans up menu list, usually before render         
         */
        cleanUpList: function () {
            if (this.menuContainer) {
                this.menuContainer.parentElement.removeChild(this.menuContainer);
                this.menuContainer = null;
            }
        },

        /**
         * Cleans up element, usually before render and detach
         * @chainable
         * @returns {zs.timePicker}
         */
        cleanUp: function () {
			document.removeEventListener("click", this.documentClickListener);
			this.documentClickListener = null;
            this.menuContainer.parentElement.removeChild(this.menuContainer);
            this.menuContainer = null;
            this.fieldContainer = null;
            this.fieldElement = null;
            this.clearIcon = null;

            this.innerHTML = "";

            return this;
        },

        /**
         * Converts int to time.
         * jquery-timepicker v1.11.12 - A jQuery timepicker plugin. Copyright (c) 2015 Jon Thornton - http://jonthornton.github.com/jquery-timepicker/ | License: MIT
         * @param {Number} timeInt - seconds passed since 00:00 hours
         * @private
         */
        _int2time: function (timeInt) {
            if (typeof timeInt != "number") {
                return null;
            }

            var seconds = parseInt(timeInt % 60),
                minutes = parseInt((timeInt / 60) % 60),
                hours = parseInt((timeInt / (60 * 60)) % 24);

            var time = new Date(1970, 0, 2, hours, minutes, seconds, 0);

            if (isNaN(time.getTime())) {
                return null;
            }

            var output = "";
            var hour;

            if (this.format24) {
                hour = time.getHours();
                if (timeInt === this._ONE_DAY) hour = 0;
                output += (hour > 9) ? hour : '0' + hour;
                output += ":";
                minutes = time.getMinutes();
                output += (minutes > 9) ? minutes : '0' + minutes;
            } else {
                hour = time.getHours() % 12;
                output += hour === 0 ? "12" : hour;
                output += ":";
                minutes = time.getMinutes();
                output += minutes > 9 ? minutes : "0" + minutes;
                output += time.getHours() > 11 ? this.lang.pm : this.lang.am;
            }
            return output;
        },

        /**
         * Converts time to int
         * jquery-timepicker v1.11.12 - A jQuery timepicker plugin. Copyright (c) 2015 Jon Thornton - http://jonthornton.github.com/jquery-timepicker/ | License: MIT
         * @param {String} timeString - time in string format
         * @private
         */
        _time2int: function (timeString) {
            if (timeString === "" || timeString === null) return null;
            if (typeof timeString == "object") {
                return (
                    timeString.getHours() * 3600 +
                    timeString.getMinutes() * 60 +
                    timeString.getSeconds()
                );
            }
            if (typeof timeString != "string") {
                return timeString;
            }

            timeString = timeString.toLowerCase().replace(/[\s\.]/g, "");

            // if the last character is an "a" or "p", add the "m"
            if (timeString.slice(-1) == "a" || timeString.slice(-1) == "p") {
                timeString += "m";
            }

            var ampmRegex =
                "(" +
                this.lang.am.replace(".", "") +
                "|" +
                this.lang.pm.replace(".", "") +
                "|" +
                this.lang.AM.replace(".", "") +
                "|" +
                this.lang.PM.replace(".", "") +
                ")?";

            // try to parse time input
            var pattern = new RegExp(
                "^" +
                ampmRegex +
                "([0-9]?[0-9])\\W?([0-5][0-9])?\\W?([0-5][0-9])?" +
                ampmRegex +
                "$"
            );

            var time = timeString.match(pattern);
            if (!time) {
                return null;
            }

            var hour = parseInt(time[2] * 1, 10);
            var ampm = time[1] || time[5];
            var hours = hour;
            var minutes = time[3] * 1 || 0;
            var seconds = time[4] * 1 || 0;

            if (hour <= 12 && ampm) {
                var isPm = ampm == this.lang.pm || ampm == this.lang.PM;

                if (hour == 12) {
                    hours = isPm ? 12 : 0;
                } else {
                    hours = hour + (isPm ? 12 : 0);
                }
            }

            var timeInt = hours * 3600 + minutes * 60 + seconds;

            return timeInt;
        },

        /**
         * Returns formatted time
         * @param {String} value - valid time string
         * @private
         */
        _getFormattedTime: function (value) {
            return this._int2time(this._time2int(value));
        },

        /**
         * Events list
         */
        events: {
            create: function () {

            },

            attach: function () {
                this.render();
            },

            attributeChange: function (event) {
                this._checkAndUpdatePropByAttr(event.detail.attributeName, event.detail.newValue);
            },

            detach: function () {
                this.cleanUp();
            }
        }
    };

    /**
     * @constructor
     * @extends HTMLDivElement
     * @extends zs.timePicker
     */
    zs.timePickerElement = zs.customElement(HTMLDivElement, 'zs-time-picker-field', 'div', [zs.clear, zs.timePicker]);

    return zs;
})(window.zs || {});
