describe('zsFilter', function () {
	var el;
	function getOverlaySpan(){
		var overlay = el.querySelector('[overlay]');
		return overlay.querySelectorAll('span');
	}
	beforeEach(function () {
		el = document.createElement('zs-filter');
	});

	it('is a custom element', function () {
		utils.isCustomElement(expect, null, 'zs-filter', zs.filterElement, HTMLElement);
		utils.isBehavior(expect, zs.filter);
	});
	it('should render select element as well as its options with selected attribute if applicable',function(done){
		el.optionData = [{ "name": "Filter1", "value": "1", "selected": true }, { "name": "Filter2", "value": "2", "selected": false }];
		document.body.appendChild(el);
		setTimeout(function () { 
			expect(el.selectContainer.tagName).toBe('DIV');
			expect(el.selectContainer.className).toBe('zs-select');
			expect(el.selectEle.tagName).toBe('SELECT');
			var optionList = el.selectEle.querySelectorAll('option');
			expect(optionList.length).toBe(2);
			var isSelectedAttr = optionList[0].hasAttribute('selected');
			var optionName = optionList[0].innerText;
			var optionValue = optionList[0].value;
			expect(isSelectedAttr).toBe(true);
			expect(optionName).toBe('Filter1');
			expect(optionValue).toBe('1');
			isSelectedAttr = optionList[1].hasAttribute('selected');
			optionName = optionList[1].innerText;
			optionValue = optionList[1].value;
			expect(isSelectedAttr).toBe(false);
			expect(optionName).toBe('Filter2');
			expect(optionValue).toBe('2');
			done();
		});
	});
	it('should render a searchable dropdown',function(done){
		el.optionData = [{ "name": "Filter1", "value": "1", "selected": true }, { "name": "Filter2", "value": "2", "selected": false }];
		document.body.appendChild(el);
		setTimeout(function(){
			expect(el.querySelectorAll('.zs-search-dropdown').length).toEqual(1);
			done();
		},0);
	});
	it('should render a label and update the label if it gets changed',function(done){
		el.optionData = [{ "name": "Filter1", "value": "1", "selected": false }, { "name": "Filter2", "value": "2", "selected": false }];
		el.label = 'Label1';
		document.body.appendChild(el);	
		setTimeout(function(){
			expect(getOverlaySpan()[0].innerText).toBe('Label1');
			el.label = 'Label Changed';
			expect(getOverlaySpan()[0].innerText).toBe('Label Changed');			
			done();
		},0)
	});
	it('should label the number of items selected and name of the selected item if only one is selected', function(done){
		el.optionData = [{ "name": "Filter1", "value": "1", "selected": false }, { "name": "Filter2", "value": "2", "selected": false }];
		el.label = 'Label1';
		document.body.appendChild(el);
		setTimeout(function(){
			var optionsNav = el.querySelector('[options]');
			var options = optionsNav.querySelectorAll('a');
			options[0].click();
			expect(getOverlaySpan()[0].innerText).toBe('Filter1');
			options[1].click();
			expect(getOverlaySpan()[0].innerText).toBe('2 Items selected');			
			done();
		},0);
	});
	it('should render dropdown with select all option',function(done){
		el.optionData = [{ "name": "Filter1", "value": "1", "selected": false }, { "name": "Filter2", "value": "2", "selected": false }];
		el.label = 'Label1';
		el.setAttribute('selectAll','');
		document.body.appendChild(el);
		setTimeout(function(){
			var optionsNav = el.querySelector('[options]');
			var options = optionsNav.querySelectorAll('a');
			expect(options[0].classList.contains('select-all')).toBe(true);
			done();
		},0)
	});
});