describe("polyfills", function () {

	function testPolyfillsLoaded() {
		var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
		var script = document.querySelector('[src*="polyfills"]');

		if (!isIE11) { // Chrome, Safari, Firefox, Edge?
			expect(script).toBeTruthy();
			script = document.querySelector('[src*="customEvent.min.js"]');
			expect(script).toBeFalsy();
			script = document.querySelector('[src*="objectAssign.min.js"]');
			expect(script).toBeFalsy();
			script = document.querySelector('[src*="customElements.min.js"]');
			expect(script).toBeFalsy();
			script = document.querySelector('[src*="promise.min.js"]');
			expect(script).toBeFalsy();

			// Check for safari
			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
				script = document.querySelector('[src*="builtInElementsInit.min.js"]');
				expect(script).toBeTruthy();
			}

		} else { // IE11
			expect(script).toBeTruthy();
			script = document.querySelector('[src*="customEvent.min.js"]');
			expect(script).toBeTruthy();
			script = document.querySelector('[src*="objectAssign.min.js"]');
			expect(script).toBeTruthy();
			script = document.querySelector('[src*="customElements.min.js"]');
			expect(script).toBeTruthy();
			script = document.querySelector('[src*="promise.min.js"]');
			expect(script).toBeTruthy();
		}
	}

	it('works in browsers', function () {
		expect(typeof Object.assign).toBe("function");
		expect(typeof CustomEvent).toBe("function");
		expect(typeof Promise).toBe("function");
		expect(typeof window.customElements).toBe('object');
	});

	it('loads only necessary in polyfills', function () {
		testPolyfillsLoaded();
	});

	it('works even if loaded asynchronously through javascript', function (done) {
		var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
		var script = document.querySelector('[src*="polyfills"]');
		script && script.parentNode.removeChild(script);

		expect(typeof Object.assign).toBe("function");
		expect(typeof CustomEvent).toBe("function");
		expect(typeof Promise).toBe("function");
		expect(typeof window.customElements).toBe('object');

		if (isIE11) {
			script = document.querySelector('[src*="customEvent.min.js"]');
			script && script.parentNode.removeChild(script);

			script = document.querySelector('[src*="objectAssign.min.js"]');
			script && script.parentNode.removeChild(script);

			script = document.querySelector('[src*="customElements.min.js"]');
			script && script.parentNode.removeChild(script);

			script = document.querySelector('[src*="promise.min.js"]');
			script && script.parentNode.removeChild(script);

			// Unload polyfills first
			delete window.customElements;
			window.Object.assign = undefined;
			window.CustomEvent = undefined;
			delete window.Promise;
		} else {
			script = document.querySelector('[src*="builtInElementsInit.min.js"]');
			script && script.parentNode.removeChild(script);
		}

		// Load polyfill script through js
		script = document.createElement("script");
		script.src = "../dist/polyfills/polyfills.js";
		script.onload = function () {
			testPolyfillsLoaded();
			done();
		}

		document.head.appendChild(script);

	});
});
