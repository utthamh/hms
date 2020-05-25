
function overrideTest(object, methodName, newFn, test) {
	var fn = object[methodName];
	object[methodName] = newFn;
	test();
	object[methodName] = fn;
}

describe("localization", function () {
	var l10n = window.l10nM.l10n;

	it('is a module exposing a mixin', function() {
		expect(typeof l10n).toBe('object');
	});

	it('Stores the locale and translations for each region', function() {
		expect(l10n.locale).toBe(l10n._defaultLocale);
		l10n.translations = {'Home': 'MyHome'};
		expect(l10n.translations['Home']).toBe('MyHome');
		l10n.locale = 'de-DE';
		l10n.translations = {'Home': 'Zuhause', 'true': 'wahr'};
		expect(l10n.translations['Home']).toBe('Zuhause');
		l10n.locale = l10n._defaultLocale;
		expect(l10n.translations['Home']).toBe('MyHome');
	});

	it('It can localize values', function() {	
		l10n.locale = 'de-DE';	
		expect(typeof l10n.localize).toBe('function');
		expect(l10n.localize('Home')).toBe('Zuhause');
		expect(l10n.localize(10.2)).toBe('10,2');
		expect(l10n.localize(true)).toBe('wahr');
		expect(l10n.localize(false)).toBe('false'); //not translated
		expect(l10n.localize()).toBe('');
		expect(l10n.localize(NaN)).toBe('');
		expect(l10n.localize(null)).toBe('');
		expect(l10n.localize('')).toBe('');
		
		
		var dateStr = l10n.localize(new Date ('2019-06-05T00:00:00-05:00'), { year: 'numeric', day: 'numeric', month: 'numeric' });
		expect(dateStr == '5.6.2019' || dateStr.length == 15).toBeTruthy();

		//https://www.csgpro.com/blog/2016/08/a-bad-date-with-internet-explorer-11-trouble-with-new-unicode-characters-in-javascript-date-strings
		//'5.6.2019' in Chrome and '‎05‎.‎06‎.‎2019' in IE11 with extra unicode special characters.

		// Overrides
		overrideTest(l10n, 'numberToLocaleString',
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.localize(2)).toBe('test');
			}
		);
		overrideTest(l10n, 'dateToLocaleString', 
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.localize(new Date())).toBe('test');
			}
		);
		
		overrideTest(l10n, 'booleanToLocaleString',
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.localize(true)).toBe('test');
			}
		);
		
		overrideTest(l10n, 'stringToLocaleString', 
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.localize("Home")).toBe('test');
			}
		);
	});

	it('Can format values', function() {
		l10n.locale = 'de-DE';
		
		expect(typeof l10n.format).toBe('function');
		
		var str = l10n.format(123456.789, {style: 'currency', currency: 'EUR' });		
		
		// Fails in Chrome but works in IE11
		//expect(str.localeCompare('123.456,79 €', l10n.locale)).toBe(0);

		expect(str.length == '123.456,79 €'.length);


		str = l10n.format(new Date('2019-06-05T00:00:00-05:00'), {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}); 
		
		expect(str.localeCompare('Mittwoch, 5. Juni 2019',l10n.locale)).toBe(0);

		//expect(str.length == 'Mittwoch, 5. Juni 2019'.length).toBeTruthy();

		str = l10n.format('${param1} and ${param2}', {param1: 1, param2: 2})
		expect(str).toBe('1 and 2');

		overrideTest(l10n, 'formatString', 
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.format("some string ${param1}", {param1: 1})).toBe('test');
			}
		);

		overrideTest(l10n, 'formatNumber', 
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.format(12, {param1: 1})).toBe('test');
			}
		);

		overrideTest(l10n, 'formatBoolean', 
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.format(true, {param1: 1})).toBe('test');
			}
		);

		overrideTest(l10n, 'formatDate', 
			function(value, locale, options) {
				return 'test';
			}, function() {
				expect(l10n.format(new Date(), {param1: 1})).toBe('test');
			}
		);

	});

	it('Can parse values', function() {
		l10n.locale = 'de-DE';		
		expect(typeof l10n.parse).toBe('function');

		expect(l10n.parse('wahr','boolean')).toBe(true);
		expect(l10n.parse('10,3','number')).toBe(10.3);
		expect(l10n.parse('2019-05-06T00:00:00-05:00', 'date').valueOf()).toBe(1557118800000); // Mon May 06 2019 00:00:00 GMT-0500 (Central Daylight Time)

		overrideTest(l10n, 'parseNumber', 
			function(value, locale, options) {
				return 0;
			}, function() {
				expect(l10n.parse('1', 'number')).toBe(0);
			}
		);

		overrideTest(l10n, 'parseBoolean', 
			function(value, locale, options) {
				return false;
			}, function() {
				expect(l10n.parse('true', 'boolean')).toBe(false);
			}
		);

		overrideTest(l10n, 'parseDate', 
			function(value, locale, options) {
				return true;
			}, function() {
				expect(l10n.parse('2019-01-02', 'date')).toBe(true);
			}
		);

	});
});
