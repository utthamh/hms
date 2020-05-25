/** 
 * Compose two or more objects. Respect property descriptors. 
 * @param {...object} Objects to compose.  target, source1, source2, ...
 * @return {object} Target object.
 * @example mix({a: 1}, {b: 2}); // {a:1, b:2}
*/
function mix() {
	var args = arguments,
		target = args[0];
	
	if (target == undefined) { return; }
	if (args.length <= 1) { return target; }

	for (var i = 1; i < args.length; i++) {
		var obj = args[i];
		if (typeof obj != 'object') {
			console.warn('Invalid parameter type "' + (typeof obj) + '" for the argument #' + i);
			continue;
		}
		
		// Prohibited properties
		let descriptors = Object.getOwnPropertyDescriptors(obj);
		delete descriptors['constructor'];
		delete descriptors['__proto__'];

		Object.defineProperties(target, descriptors);
	}
	return target;
}

// Object.getOwnPropertyDescriptors polyfill for IE11
if (!Object.hasOwnProperty('getOwnPropertyDescriptors')) {
	var supportsSymbol = Object.hasOwnProperty('getOwnPropertySymbols');
	Object.defineProperty(
		Object,
		'getOwnPropertyDescriptors',
		{
			configurable: true,
			writable: true,
			value: function getOwnPropertyDescriptors(object) {
				var keys = Object.getOwnPropertyNames(object);
				if (supportsSymbol) {
					keys = keys.concat(Object.getOwnPropertySymbols(object));
				}

				return keys.reduce(function (descriptors, key) {
					return Object.defineProperty(
						descriptors,
						key,
						{
							configurable: true,
							enumerable: true,
							writable: true,
							value: Object.getOwnPropertyDescriptor(object, key)
						}
					);
				}, {});
			}
		}
	);
}

/**
 * Functional piping 
 * @param  {...function} fns - One or more functions to use in composition
 * @return {function} - Pipe entry. Accepts a single argument.
 * @example uppercase = (string) => string.toUpperCase();
 * @example get6Characters = (string) => string.substring(0, 6);
 * @example pipe(uppercase, get6Characters)("My long string"); // MY LON
 */
let pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);


export {mix, pipe};