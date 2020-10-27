/**
 * Polyfill document.currentScript if needed.
 * Adapted from document.currentScript polyfill by James M. Greene - https://github.com/JamesMGreene/document.currentScript -MIT @license
 */

(function () {

	var scripts = document.getElementsByTagName("script");

	// If there is only a single inline script on the page, return it; otherwise `undefined`
	function getSoleInlineScript() {
		var script;
		for (var i = 0, len = scripts.length; i < len; i++) {
			if (!scripts[i].src) {
				if (script) {
					return undefined;
				}
				script = scripts[i];
			}
		}
		return script;
	}

	// Get script object based on the `src` URL
	function getScriptFromUrl(url) {
		if (typeof url === "string" && url) {
			for (var i = 0, len = scripts.length; i < len; i++) {
				if (scripts[i].src === url) {
					return scripts[i];
				}
			}
		}
		//return undefined;
	}

	// Get the currently executing script URL from an Error stack trace
	function getScriptUrlFromStack(stack, skipStackDepth) {
		var url, matches, remainingStack,
			ignoreMessage = typeof skipStackDepth === "number";
		skipStackDepth = ignoreMessage ? skipStackDepth : (typeof _currentScript.skipStackDepth === "number" ? _currentScript.skipStackDepth : 0);
		if (typeof stack === "string" && stack) {
			if (ignoreMessage) {
				matches = stack.match(/((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
			}
			else {
				matches = stack.match(/^(?:|[^:@]*@|.+\)@(?=http[s]?|file)|.+?\s+(?: at |@)(?:[^:\(]+ )*[\(]?)((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
				if (!(matches && matches[1])) {
					matches = stack.match(/\)@((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
					if (matches && matches[1]) {
						url = matches[1];
					}
				}
			}

			if (matches && matches[1]) {
				if (skipStackDepth > 0) {
					remainingStack = stack.slice(stack.indexOf(matches[0]) + matches[0].length);
					url = getScriptUrlFromStack(remainingStack, (skipStackDepth - 1));
				}
				else {
					url = matches[1];
				}
			}
		}
		return url;
	}

	// Get the currently executing `script` DOM element
	function _currentScript() {
		try {
			throw new Error();
		}
		catch (err) {
			// NOTE: Cannot use `err.sourceURL` or `err.fileName` as they will always be THIS script
			var pageUrl = window.location.href;
			var url = getScriptUrlFromStack(err.stack);
			var script = getScriptFromUrl(url);

			if (!script && url === pageUrl) {
				script = getSoleInlineScript();
			}

			return script;
		}
	}

	// Configuration
	_currentScript.skipStackDepth = 1;

	// Add the "private" property for testing, even if the real property can be polyfilled
	if (!("currentScript" in document)) {
		document._currentScript = _currentScript;
	}

})();

/**
 * Detecting gaps in the platform and activate polyfills
 */
(function () {
	'use strict';

	if (typeof window === 'undefined') {
		return;
	}

	// Detect script URL
	var currScript = document.currentScript || document._currentScript(),
		src = currScript && currScript.getAttribute("src") || "/",
		baseUrl;

	var arr = src.split('/');
	if (arr.length) {
		arr.pop();
		baseUrl = arr.join('/');
	} else {
		baseUrl = '';
	}

	// Detect if builtIns supported
	var isBuiltInsSupported = true;

	// class LI extends HTMLLIElement {}
	try {
		var HtmlLI = HTMLLIElement;
		var LI = function () {
			return Reflect.construct(HtmlLI, [], LI);
		};
		LI.prototype = Object.create(HtmlLI.prototype);

		var uniqueElementName = 'my-zs-li' + new Date().valueOf();
		customElements.define(uniqueElementName, LI, { extends: 'li' });

		if (!new RegExp('is="' + uniqueElementName + '"').test((new LI).outerHTML)) {
			throw {};
		}
	} catch(error) {
		isBuiltInsSupported = false;
	}


	function addScript(url) {
		var script = document.createElement('script');
		script.src = url;
		
		// ZSUI-1087 To preserve execution sequence, use document.write when polyfill script is loaded synchronously.
		// Unlike appendChild, document.write executes the loaded script immediately, thus preserving execution sequence.
		if(!currScript.defer && !currScript.async){
			document.write(script.outerHTML);
			return;
		}

		//Append script element when polyfill script is loaded asynchronously, as document.write would fail here.
		var scripts = document.getElementsByTagName('script')[0];
		if (scripts) {
			scripts.parentNode.insertBefore(script, scripts);
		} else {
			scripts = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
			scripts.appendChild(script);
		}
	}

	function polyfill(baseUrl) {
		baseUrl = baseUrl || '.';

		// Custom Event
		if (typeof window.CustomEvent != 'function') {
			console.warn('loading CustomEvent polyfill');
			addScript(baseUrl + '/customEvent.min.js');
		}

		
		// Object assign
		if (!Object.assign) {
			console.warn('loading Object.assign polyfill');
			addScript(baseUrl + '/objectAssign.min.js');
		}

		// Promise
		if (typeof Promise != 'function') {
			console.warn('loading Promise polyfill');
			addScript(baseUrl + '/promise.min.js');
		}
	

		// Custom Elements
		if (typeof window.customElements != 'object') {
			console.warn('loading customElements polyfill');
			addScript(baseUrl + '/customElements.min.js');

		} else if (!isBuiltInsSupported) {
			console.warn('loading builtIns polyfill');
			addScript(baseUrl + '/builtInElementsInit.min.js'); // For iOS Safari
		}

		// Polyfill foreEach on DOM elements for IE11
		if (window.NodeList && !NodeList.prototype.forEach) {
			NodeList.prototype.forEach = Array.prototype.forEach;
		}
	}

	polyfill(baseUrl);
})();
