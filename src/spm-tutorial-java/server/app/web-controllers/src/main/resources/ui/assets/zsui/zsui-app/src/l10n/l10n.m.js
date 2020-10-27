

/**
 * Localization (l10n) is the process of adapting internationalized software for a specific region or language by translating text and adding locale-specific components. This module provides a basic level we typically need in our applications but enables deeper customization.
 * @module l10n
 * @exports l10n
 * @example <script src="l10n/l10n.js"></script><script>var l10n = window.l10nM.l10n;</script>
 * @example import l10n from "l10n/l10n.m.js" 
 */

var _locale, _translations = {};

/**
 * Localization
 * @mixin
 */
let l10n = {

	/**
	 * Default locale
	 * @private
	 * @property 
	 * @type {string}
	 */
	_defaultLocale: 'en-US',

	/**
	 * Get or set the current locale. Must be either a string holding a BCP 47 language tag, or an array of such language tags. {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument}
	 * @type {string}
	 * @property 
	 * @example l10n.locale = "de-DE";
	 */
	set locale(newLocale) {
		_locale = newLocale;
	},
	get locale() {
		return _locale || this._defaultLocale || 'en-US';
	},


	/**
	 * Get or set translations for the current locale. It stores translation for different locales in an object like `{'en-US': {'Home': 'Home'}, 'de-DE': {'Home': 'Zuhause'}}`.
	 * @type {object} 
	 * @example l10n.translations = {"Home": "Zuhause", "true": "wahr"};
	 */
	set translations(newStrings) {
		_translations[this.locale] = newStrings;
	},
	get translations() {
		return _translations[this.locale];
	},



	/**
	 * Localize a value with respect to the type.
	 * @param {string|number|date|boolean} value - Value to localize
	 * @return {string} - Localized value of the key
	 */
	localize(value, options) {
		if (value == null) { return ''; } // null and undefined	

		var typeStr = typeof value;
		if (typeStr == 'number' && isNaN(value)) { return ''; } // NaN


		if (value instanceof Date) { typeStr = 'date'; }
		var methodName = `${typeStr}ToLocaleString`;

		if (typeof this[methodName] == 'function') {
			return this[methodName](value, this.locale, options);
		} else if (typeof value.toLocaleString == 'function') {
			return value.toLocaleString(this.locale, options);
		}
		return value.toString();
	},

	/**
	 * Translate a string. We use translations by default but expose this method for customization
	 * @param {string} str - String value to translate
	 * @param {string=} locale - Locale
	 * @param {object=} options - Extra options
	 * @returns {string} Translated string
	 */
	stringToLocaleString(str, locale, options) {
		locale = locale || this.locale;
		if (_translations && _translations[locale || _locale]) {
			str = _translations[locale || _locale][str] || str;
		}
		return str;
	},

	/**
	 * Translate a boolean value. We use translations by default but expose this method for customization
	 * @param {boolean} bool - Boolean value to translate
	 * @param {string=} locale - Locale
	 * @param {object=} options - Extra options
	 * @returns {string} Translated string
	 */
	booleanToLocaleString(bool, locale, options) {
		var str = bool.toString();
		locale = locale || this.locale;
		if (_translations && _translations[locale || _locale]) {
			str = _translations[locale || _locale][str] || str;
		}
		return str;
	},

	/**
	 * Format the value using built-in or custom formatting methods. We detect the type of the value and call appropriate method which can be customized.
	 * @param {string|number|date|boolean} value - Value to format. 
	 * @param {object=} options - Formatting options 
	 * @returns {string} Formatted value. Unicode strings might not behave the save way as regular strings. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare localeCompare}
	 * @example l10n.format(new Date(), {"weekday":"long","year":"numeric","month":"long","day":"numeric"}); // l10n.formatDate(...) is called
	 */
	format(value, options) {
		if (value == null) { return ''; } // null and undefined	
		var typeStr = typeof value;
		if (value instanceof Date) { typeStr = 'date'; }
		typeStr = typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
		var methodName = `format${typeStr}`;
		if (typeof this[methodName] == 'function') {
			return this[methodName](value, this.locale, options);
		} else if (typeof value.format == 'function') {
			return value.format(this.locale, options);
		}
		return value.toString();
	},

	/**
	* Customize how we format strings. By default we use interpolation
	* @param {string} value - String to format
	* @param {string=} locale - Locale to be used or l10n.locale
	* @param {object=} options - Formatting options 
	* @returns {string} Formatted string
	* @example l10n.formatString("${name} said Hello", "en-US", {name: "Mike"}); // Mike said Hello
	*/
	formatString(value, locale, options) {
		var formatted = value.toString();
		locale = locale || this.locale;
		for (var i in options) {
			var regexp = new RegExp('\\$\{' + i + '\\}', 'gi');
			formatted = formatted.replace(regexp, options[i]);
		}
		return formatted;
	},

	/**
	 * How we format numbers. We use built-in {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat Intl} API for that by default but expose this for customization.
	 * @param {number} value - Number to format
	 * @param {string=} locale - Locale 
	 * @param {object=} options - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters Formatting options} 
	 * @returns {string} Formatted string
	 * @example l10n.formatNumber(1545606234, 'de-DE', {"style":"currency","currency":"EUR"}); //1.545.606.234,00 €
	 */
	formatNumber(value, locale, options) {
		locale = locale || this.locale;
		return new Intl.NumberFormat(locale, options).format(value);
	},

	/**
	 * How we format dates. We use built-in  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat  Intl} API for that by default but expose this for customization.
	 * @param {number} value - Number to format
	 * @param {string=} locale - Locale to use or current locale we be used.
	 * @param {object=} options - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters Formatting options} 
	 * @returns {string} Formatted string 
	 * @example l10n.formatDate(new Date('2019-06-05T00:00:00-05:00'), 'en-US', options: {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) // Wednesday, June 5, 2019
	 */
	formatDate(value, locale, options) {
		return new Intl.DateTimeFormat(locale, options).format(value);
	},


	/**
	 * Parse string to value. Call an appropriate method for each type.
	 * @param {string} stringValue - String value to parse
	 * @param {string} valueType - Type of the expected result
	 * @param {object=} options - Parsing options 
	 * @returns {string|number|boolean|date|null|undefined} - Parsed value in a primitive type
	 * @example l10n.parse('true', 'boolean'); // calls l10n.parseBoolean
	 */
	parse(stringValue, valueType, options) {
		if (stringValue === null) { return null; } // null 
		if (stringValue === undefined) { return; } // undefined

		valueType = valueType.charAt(0).toUpperCase() + valueType.slice(1);
		var methodName = `parse${valueType}`;
		if (typeof this[methodName] == 'function') {
			return this[methodName](stringValue, this.locale, options);
		}
		return; // or undefined
	},

	/**
	 * Parse number from the string. This method is designed to be overridden to enable deeper levels of internalization
	 * @param {string} stringValue - Value 
	 * @param {locale=} locale - Locale to use or current locale.
	 * @options {object=} options - Extra options that  can be used in a parser.
	 * @returns {number} - Number parsed from a string
	 * @example l10n.parseNumber('10,2', 'de-DE'); // 10.2
	 */
	parseNumber(stringValue, locale, options) {
		locale = locale || this.locale;

		// Detect separator
		let str = this.localize(10.2); // 10,2 for de-DE
		let arr = str.split(/[0-9]+/ig); // "10,2" => ["", ",", ""]  ",2" => [",", ""] 
		let separator;
		if (arr.length == 2) {
			separator = arr[0];
		} else if (arr.length == 3) {
			separator = arr[1];
		}

		if (separator) {
			stringValue = stringValue.replace(separator, '.');
		}
		return Number(stringValue);
	},

	/**
	 * Parse boolean from a string. This method is designed to be overridden to enable deeper levels of internalization
	 * @param {string} stringValue - Value 
	 * @param {string=} locale - Locale or current locale will be used from `l10n.locale`
	 * @options {object=} options - Extra parsing options.
	 * @returns {boolean} - Boolean value parsed from a string
	 * @example l10n.parseBoolean('wahr', 'de-DE'); // true
	 */
	parseBoolean(stringValue, locale, options) {
		locale = locale || this.locale;
		if (stringValue == this.localize('true')) { return true; }
		if (stringValue == this.localize('false')) { return false; }
		return Boolean(stringValue);
	},

	/**
	 * Parse date from a string. This method is designed to be overridden to enable deeper levels of internalization and will not work correctly for different regions since it is limited by a native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse Date.parse} method capabilities.
	 * @param {string} stringValue - String representing a date
	 * @param {string=} locale - Locale or current locale will be used from `l10n.locale`
	 * @options {object=} options - Extra parsing options.
	 * @returns {date} - Date value parsed from a string
	 * @example l10n.parseDate('6.5.2019', 'de-DE'); // Wed Jun 05 2019 00:00:00 GMT-0500 (Central Daylight Time)
	 */
	parseDate(stringValue, locale, options) {
		locale = locale || this.locale;
		return new Date(stringValue);
	}
}

export { l10n };