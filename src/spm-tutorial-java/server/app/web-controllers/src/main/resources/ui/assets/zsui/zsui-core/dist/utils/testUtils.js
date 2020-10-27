var utils = utils || (function () {

	function isPlugin(expect, name) {
		expect($).toBeTruthy();
		expect(typeof $.fn[name]).toBe('function');

		// Override test
		$.fn[name]({
			myProp: 3
		});

		// Apply a plugin
		$('body').append('<div><div id="testPlugin"></div></div>').find('#testPlugin')[name]({});
		var plugin = $('#testPlugin').data(name);
		expect(plugin).toBeTruthy();
		expect(plugin.myProp).toBe(3);
		$('#testPlugin').parent().remove();
	}

	function isConfigurable(expect, name) {
		$('body').append('<div><div id="testPlugin"></div></div>');
		$container = $('#testPlugin');
		$container[name]({
			a: 1,
			b: 2
		});

		var plugin = $container.data(name);

		expect(plugin.options.a).toBe(1);
		expect(plugin.options.b).toBe(2);

		$container.zsModalDialog({
			b: 3
		});

		expect(plugin.options.a).toBe(1);
		expect(plugin.options.b).toBe(3);
	}

	function isRemovable(expect, name, fn) {
		$('body').append('<div><div id="testPlugin"></div></div>');
		$container = $('#testPlugin');
		$container[name]({});
		var plugin = $container.data(name);
		expect(plugin).toBeTruthy();
		$container[name]('destroy');
		plugin = null;
		var plugin = $container.data(name);
		expect(plugin).toBeFalsy();
	}

	function canDeclareCustomElement(expect, isWhat, tag, elementConstructor, parentElement) {
		if (!isWhat) { return; }

		var container = document.createElement('div');
		container.setAttribute('id', 'container');

		if (isWhat && tag) {
			container.innerHTML = '<' + tag + ' is="' + isWhat + '"></' + tag + '>';
		} else if (isWhat) {
			tag = isWhat;
			container.innerHTML = '<' + isWhat + '></' + isWhat + '>';
		}

		document.body.appendChild(container);
		var elem = container.querySelector(tag);
		expect(elem == null).toBeFalsy();
		expect(elem instanceof HTMLElement).toBeTruthy();
		if (elementConstructor) {
			expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();
			//expect(elem instanceof elementConstructor).toBeTruthy(); // TODO: Doesn't work in IE11
		}
		document.body.removeChild(container);

	}

	function isCustomElement(expect, isWhat, tag, elementConstructor, parentElement) {
		var elem, container;

		// Can create an element via constructor
		if (elementConstructor && !tag) { // Wouldn't work in Safari when customizing built-ins
			expect(typeof elementConstructor).toBe('function');
			elem = new elementConstructor();
			expect(typeof elem).toBe('object');
			expect(elem == null).toBeFalsy();
			expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();
		}

		// Can create via tag name
		if (isWhat && tag) { // <div is="my-element"></div> 
			elem = document.createElement(tag, {is: isWhat});
			expect(typeof elem).toBe('object');
			expect(elem == null).toBeFalsy();
			expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();

		} else if (isWhat) { // <my-element></my-element>
			elem = document.createElement(isWhat);
			expect(typeof elem).toBe('object');
			expect(elem == null).toBeFalsy();
			expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();
		}

		// Can create via HTML
		canDeclareCustomElement(expect, isWhat, tag, elementConstructor, parentElement);
	}

	function isPropAttrSync(expect, done, element, propName, type) {
		var syncProps = window.syncPropsM ? window.syncPropsM.default : zs;


		if (type == 'boolean') {
			element[propName] = true;
		} else if (type == 'number') {
			element[propName] = 1;
		} else {
			element[propName] = '1';
		}
		var attrName = syncProps.propToAttrName(propName);
		var tag = element.tagName.toLowerCase();
		var isAttr = element.getAttribute('is') || element._is;
		document.body.innerHTML += '<div class="test' + propName + '"><' + tag + (isAttr ? ' is="' + isAttr + '" ' : ' ') + (type == 'boolean' ? attrName : attrName + '="2"') + '></' + tag + '></div>';
		setTimeout(function () {
			var element2 = document.querySelector('div.test' + propName).firstChild;
			if (type == 'boolean') {
				expect(element.getAttribute(attrName) == '' || element.getAttribute(attrName) == 'true').toBeTruthy();
				expect(element2[propName]).toBe(true);
			} else if (type == 'number') {
				expect(element.getAttribute(attrName)).toBe('1');
				expect(element2[propName] == 2).toBeTruthy();
			} else {
				expect(element.getAttribute(attrName)).toBe('1');
				expect(element2[propName] == '2').toBeTruthy();
			}
			element2.parentNode.parentNode.removeChild(element2.parentNode);
			element2 = null;
			if (typeof done == 'function') {done();}
		}, 10);
	}

	function isBehavior(expect, behavior) {
		expect(typeof behavior).toBe('object');
		expect(behavior == null).toBeFalsy();
	}

	function isRenderedOnce(element, attributes, expect, done, spyOn) {
		spyOn(element, 'render').and.callThrough();

		for (var i in attributes) {
			element.setAttribute(i, attributes[i]);
		}

		document.body.appendChild(element);

		setTimeout(function () {
			expect(element.render).toHaveBeenCalledTimes(1);
			done();
		}, 10);
	}

	return {
		isPlugin: isPlugin,
		isConfigurable: isConfigurable,
		isRemovable: isRemovable,
		isBehavior: isBehavior,
		isCustomElement: isCustomElement,
		isPropAttrSync: isPropAttrSync,
		isRenderedOnce: isRenderedOnce
	};
})();

// @todo modules actualy MUST NOT be global
if (typeof module !== 'undefined' && module.exports) {
	exports.utils = utils;
}

/**
   * Polyfill MouseEvent : https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
   *  - screenX ✓
   *  - screenY ✓
   *  - clientX ✓
   *  - clientY ✓
   *  - ctrlKey ✓
   *  - shiftKey ✓
   *  - altKey ✓
   *  - metaKey ✓
   *  - button ✓
   *  - buttons ✓
   *  - region ✓
   */
try {
	var event = new window.MouseEvent('event', { bubbles: true, cancelable: true });
} catch (error) {
	var MouseEventOriginal = window.MouseEvent || window.Event;
	var MouseEvent = function (eventName, params) {
		params = params || {};
		var event = document.createEvent('MouseEvent');

		// https://msdn.microsoft.com/en-us/library/ff975292(v=vs.85).aspx
		event.initMouseEvent(
			eventName,
			(params.bubbles === void 0) ? false : params.bubbles,
			(params.cancelable === void 0) ? false : params.cancelable,
			(params.view === void 0) ? window : params.view,
			(params.detail === void 0) ? 0 : params.detail,
			(params.screenX === void 0) ? 0 : params.screenX,
			(params.screenY === void 0) ? 0 : params.screenY,
			(params.clientX === void 0) ? 0 : params.clientX,
			(params.clientY === void 0) ? 0 : params.clientY,
			(params.ctrlKey === void 0) ? false : params.ctrlKey,
			(params.altKey === void 0) ? false : params.altKey,
			(params.shiftKey === void 0) ? false : params.shiftKey,
			(params.metaKey === void 0) ? false : params.metaKey,
			(params.button === void 0) ? 0 : params.button,
			(params.relatedTarget === void 0) ? null : params.relatedTarget
		);

		event.buttons = (params.buttons === void 0) ? 0 : params.buttons;
		event.region = (params.region === void 0) ? null : params.region;

		return event;
	};
	MouseEvent.prototype = MouseEventOriginal.prototype;
	window.MouseEvent = MouseEvent;
}
