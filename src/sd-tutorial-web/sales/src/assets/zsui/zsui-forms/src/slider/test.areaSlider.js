describe("zsAreaSlider", function () {
	var el;
    it('smart custom element', function (done) {
		el = document.createElement('zs-area-slider');
        utils.isCustomElement(expect, 'zs-area-slider', null, zs.boxSlider, HTMLElement);
		utils.isRenderedOnce(el,{'x-value':100, 'x-max': 200}, expect, done, spyOn);
		
	});
	describe('smart with attributes and properties', function() {
		it('xValue', function(done) {
			el = document.createElement('zs-area-slider');
			utils.isPropAttrSync(expect, done, el, 'xValue', 'number');
		});
		it('yValue', function(done) {
			el = document.createElement('zs-area-slider');
			utils.isPropAttrSync(expect, done, el, 'yValue', 'number');
		});
		it('xMin', function(done) {
			el = document.createElement('zs-area-slider');
			utils.isPropAttrSync(expect, done, el, 'xMin', 'number');
		});

		it('xMax', function(done) {
			el = document.createElement('zs-area-slider');
			utils.isPropAttrSync(expect, done, el, 'xMax', 'number');
		});

		it('yMin', function(done) {
			el = document.createElement('zs-area-slider');
			utils.isPropAttrSync(expect, done, el, 'yMin', 'number');
		});

		it('yMax', function(done) {
			el = document.createElement('zs-area-slider');
			utils.isPropAttrSync(expect, done, el, 'yMax', 'number');
		});



	});

	it('Draws a handle according to axis values', function(done) {
		el = document.createElement('zs-area-slider');
		$(el).css({	width:'200px',
					height: '200px', 
					display:'block'});

		el.xValue = 50;
		el.yValue = 75;
		document.body.appendChild(el);

		setTimeout(function() { 
			var $handle = $(el).find('[handle]');
			expect($handle .length).toBeTruthy();
			console.log($handle);
			var l = $handle.position().left;
			var t = $handle.position().top;
			expect(l > 0 ).toBeTruthy();
			expect(t > 0).toBeTruthy();
			expect(t>l).toBeTruthy();
			done();
		},100)
	});

	it('Supports change event', function(done) {
		el = document.createElement('zs-area-slider');
		$(el).css({	width:'200px',
					height: '200px'});

		document.body.appendChild(el);
		var count = 0;
		el.addEventListener('change', function(e) {
			expect(e.detail.xValue).toBe(50);
			count++;
			if (count == 6) {
				expect(e.detail.yMin).toBe(10);
				expect(e.detail.xMin).toBe(10);
				expect(e.detail.xMax).toBe(200);
				expect(e.detail.yMax).toBe(200);
				expect(e.detail.yValue).toBe(75);
				done();
			}
		});

		el.xValue = 50;
		el.yValue = 75;
		el.xMax = 200;
		el.yMax = 200;
		el.yMin = 10;
		el.xMin = 10;
	});


	it('Handles boundaries', function() {
		el = document.createElement('zs-area-slider');

		el.xMax = 50;
		el.xMin = 10;
		el.yMin = 20;
		el.yMax = 60;
		el.xValue = 51;		
		expect(el.xValue).toBe(50);
		el.xValue = 9;
		expect(el.xValue).toBe(10);
		
		el.yValue = 61;		
		expect(el.yValue).toBe(60);
		
		el.yValue = 19;		
		expect(el.yValue).toBe(20);
	});

	it('Reacts to mouse', function(done) {
		el = document.createElement('zs-area-slider');
		$(el).css({	width:'200px',
					height: '200px'});

		document.body.appendChild(el);

		var x0 = el.xValue;
		var y0 = el.yValue;

		var rect = el.getBoundingClientRect(); // Mouse coordinates are global so we need to make sure it is inside our slider.

		// Mimic a mouse drag.
		var event1 = new MouseEvent("mousedown", {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: rect.left + 55,
			clientY: rect.top + 55
		});
		var event2 = new MouseEvent("mouseup", {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: rect.left + 65,
			clientY: rect.top + 65
		});


		var count = 0;
		el.addEventListener('change', function(e) {
			count++;
			if (count == 1) {
				expect(this.mouseX).toBeTruthy();
				expect(this.mouseY).toBeTruthy();
				expect(this.xValue != x0).toBeTruthy();
			} else {
				expect(this.yValue != y0).toBeTruthy();
			}
			done();
		});

		el.dispatchEvent(event1);
		el.dispatchEvent(event2);

	});

	xit('Reacts to keyboard [todo]', function(done) {
		el = document.createElement('zs-area-slider');
		$(el).css({	width:'200px',
					height: '200px'});

		document.body.appendChild(el);

		var x0 = el.xValue;
		var y0 = el.yValue;
		el.focus();

		// Mimic the mouse drag.
		var e = $.Event('keyup');
		e.keyCode = 37; // ← 37, ↑ 38, → 39,  ↓ 40 


		var count = 0;
		el.addEventListener('change', function(e) {
			count++;
			if (count == 1) {
				expect(this.mouseX).toBeTruthy();
				expect(this.mouseY).toBeTruthy();
				expect(this.xValue != x0).toBeTruthy();
				console.log('here', this);
			} else {
				expect(this.yValue != y0).toBeTruthy();
			}
			done();
		});

		$(el).trigger(e);
	});
	
	afterEach(function() {
		if (el && el.parentElement) {
			el.parentElement.removeChild(el);
		}
	})
   
});
