describe('zsCard', function () {
	var el;

	beforeEach(function () {
		el = document.createElement('zs-card');
	});

	it('is a custom element', function () {
		utils.isCustomElement(expect, null, 'zs-card', zs.cardElement, HTMLElement);
		utils.isBehavior(expect, zs.card);
	});
	it('should add a class as zs-card', function (done) {
		document.body.appendChild(el);
		setTimeout(function () { // IE11
			expect(el.className).toBe('zs-card');
			done();
		});
	});
	it('should render a tag as headerEle', function (done) {
		expect(el.headerEle).toBe(null);
		document.body.appendChild(el);
		setTimeout(function () { // IE11
			expect(el.headerEle.tagName).toBe('HEADER');
			done();
		});
	});
	it('should render a tag as sectionEle', function (done) {
		expect(el.sectionEle).toBe(null);
		document.body.appendChild(el);
		setTimeout(function () { // IE11
			expect(el.sectionEle.tagName).toBe('SECTION');
			done();
		});
	});
	it('should render a tag as footerEle', function (done) {
		expect(el.footerEle).toBe(null);
		document.body.appendChild(el);
		setTimeout(function () { // IE11
			expect(el.footerEle.tagName).toBe('FOOTER');
			done();
		});
	});
	it('should be act as filter when filter attribute is passed', function (done) {
		el.setAttribute('filter', '');
		document.body.appendChild(el);
		setTimeout(function () { //IE11
			el.click();
			setTimeout(function () {
				var getFilterValue = el.getAttribute('filter');
				expect(getFilterValue).toBe('on');
				done();
			});

		});
	});
	it('should be act as flippable card when flippable attribute is passed', function (done) {
		el.setAttribute('flippable', '');
		document.body.appendChild(el);
		setTimeout(function () { //IE11
			var cardContainer = el.querySelector('.zs-flip-card');
			var frontFaceContainer = el.querySelector('.front');
			var backFaceContainer = el.querySelector('.back');
			expect(cardContainer).toBeTruthy();
			expect(frontFaceContainer).toBeTruthy();
			expect(backFaceContainer).toBeTruthy();
			var flipIcon = el.querySelectorAll('header a.zs-icon-frame-next');
			for (var i = 0; i < flipIcon.length; i++) {
				expect(flipIcon[i]).toBeTruthy();
				flipIcon[i].click();
				var flipAttr = el.getAttribute('flip');
				if (i == 0) {
					expect(flipAttr).toBe('');
				}
				else {
					expect(flipAttr).toBe(null);
				}
			}
			done();
		}, 0);
	});
	it('should sync property with attribute', function (done) {
		utils.isPropAttrSync(expect, done, el, 'filter');
	})
});
