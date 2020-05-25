describe('Highlight', function () {
	var el;
	it('is a behavior', function() {
		utils.isBehavior(expect, zs.highlight);
	});

	beforeEach(function () {
		el = document.createElement('div');
		el2 = document.createElement('div');
		Object.assign(el, zs.highlight); // we can do that just because it is a flat behavior.
		el.innerHTML = 'My keyword. Test test test. Check Spl<i>itted</i>';
		el2.innerHTML = 'My keyword. Test test test. Check Spl<i>itted</i>';
		document.body.appendChild(el);
		document.body.appendChild(el2);
	});

	it('Can highlight found keyword in the text fragment', function () {
		var keyword = 'My keyword';
		var keyword2 = 'Check';
		expect(typeof el.highlight).toBe('function');
		el.highlight(keyword);
		var mark = el.querySelector('mark');
		expect(mark).toBeTruthy();
		expect(mark.innerHTML).toBe(keyword);

		el.highlight.call(el2, keyword2);
		mark = el2.querySelector('mark');
		expect(mark).toBeTruthy();
		expect(mark.innerText).toBe(keyword2);
	});

	it('Can lowlight', function () {
		var keyword = 'My keyword';
		el.highlight(keyword);
		el.lowlight();
		var mark = el.querySelector('mark');
		expect(mark).toBeFalsy();
	});

	it('Can higlight found keyword from specific scope', function(){
		var keyword = 'My keyword';
		el.highlight(keyword, false ,el2);
		mark = el2.querySelector('mark');
		expect(mark).toBeTruthy();
		expect(mark.innerText).toBe(keyword);
	});

	it('Highlights all found matches', function () {
		var keyword = 'test';
		el.highlight(keyword);
		var marks = el.querySelectorAll('mark');
		expect(marks.length).toBe(3);
	});

	it('Highlights with tags words', function () {
		var keyword = 'itted';
		el.highlight(keyword);
		var mark = el.querySelector('mark');
		expect(mark).toBeTruthy();
	});	

	it('Will retain the html hierarchy', function(){
		var keyword = 'itted';
		el.highlight(keyword);
		var italicTag = el.querySelector('i');
		expect(italicTag).toBeTruthy();
	});

	it('Can be case sensitive', function () {
		var keyword = 'check';
		el.highlight(keyword, true);		
		var mark = el.querySelector('mark');
		expect(mark).toBeFalsy();
		el.highlight(keyword, false);		
		var mark = el.querySelector('mark');
		expect(mark).toBeTruthy();

	});

	it('should support NodeList as a parameter', function () {
		var keyword = 'check';
		el.highlight(keyword, false, document.querySelectorAll('div'));
		var count = document.querySelectorAll('mark').length;
		expect(count).toBe(2);
	});

	it('should preserve the event listeners', function () {
		var mockObj = {
			mockFun: function() {}
		}
		spyOn(mockObj, 'mockFun');
		
		var span = document.createElement('span');
		span.appendChild(el.firstChild);
		el.appendChild(span);
		span.addEventListener('click', mockObj.mockFun);
		
		var keyword = 'check';
		el.highlight(keyword, false);
		el.querySelector('span').dispatchEvent(new CustomEvent('click'));
		expect(mockObj.mockFun).toHaveBeenCalled();
	});

	afterEach(function () {
		el.parentNode.removeChild(el);
		el2.parentNode.removeChild(el2);
	});
});