describe('zsDrawer', function () {
	var el;

	beforeEach(function () {
		el = document.createElement('zs-drawer');
	});

	it('is a custom element', function () {
		utils.isCustomElement(expect, null, 'zs-drawer', zs.drawerElement, HTMLElement);
		utils.isBehavior(expect, zs.drawer);
	});
	it('renders a drawer', function (done) {
		document.body.appendChild(el);
		setTimeout(function () { // IE11
			expect(el.querySelector('toggle')).toBeTruthy();
			done();
		}, 100);
	});

	it('Supports open attribute ', function (done) {
		document.body.appendChild(el);
		utils.isPropAttrSync(expect, done, el, "open", 'boolean')
	});

	it('Supports embedded attribute ', function (done) {
		document.body.appendChild(el);
		utils.isPropAttrSync(expect, done, el, "embeded", 'boolean')
	});

	it('Supports align attribute ', function (done) {
		document.body.appendChild(el);
		utils.isPropAttrSync(expect, done, el, "align")
	});


	it('Can be toggled', function (done) {
		document.body.appendChild(el);
		var toggledEvent = false;
		el.addEventListener('toggle', function (e) {
			toggledEvent = true;
		})

		expect(el._duration).toBeTruthy();
		el._duration = 50;
		setTimeout(function () { // Render first
			el.open = true;
			setTimeout(function () {
				expect(toggledEvent).toBeTruthy();
				done();
			}, el._duration + 100);
		}, 100);
	});

	afterEach(function () {
		if (el.parentNode) {
			//el.parentNode.removeChild(el);
		}
	})

});


// Override to compare using type
utils.isPropAttrSync = function (expect, done, element, propName, type) {
	if (type == 'boolean') {
		element[propName] = true;
	} else {
		element[propName] = 'test1';
	}
	var tag = element.tagName.toLowerCase();
	var isAttr = element.getAttribute('is');
	if (isAttr) {
		document.body.innerHTML += '<div class="test' + propName + '"><' + tag + ' is="' + isAttr + '" ' + (type == 'boolean' ? propName : propName + '="test2"') + '></' + tag + '></div>';
	} else {
		document.body.innerHTML += '<div class="test' + propName + '"><' + tag + ' ' + (type == 'boolean' ? propName : propName + '="test2"') + '></' + tag + '></div>';
	}
	setTimeout(function () {
		var element2 = document.querySelector('div.test' + propName).firstChild;
		if (type == 'boolean') {
			expect(element.getAttribute(propName) != null).toBeTruthy();
			expect(element2[propName]).toBe(true);
		} else {
			expect(element.getAttribute(propName)).toBe('test1');
			expect(element2[propName]).toBe('test2');
		}
		element2.parentNode.parentNode.removeChild(element2.parentNode);
		element2 = null;
		done();
	}, 10);
}
