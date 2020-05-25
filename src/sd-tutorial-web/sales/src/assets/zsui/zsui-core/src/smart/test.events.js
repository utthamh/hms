describe('smart events', function() {
	var mix = window.mixinM.mix,
		button;
		
		
	beforeEach(function() {
		button = document.createElement('button');
		mix(button, window.eventsM); // IE11 can't use {on, off, eventHandler}
		document.body.appendChild(button);

	})

	it('handleEvent, on, fire', function (done) {
		
		button.oncustomevent1 = function(event) {
			expect(event.type=="customevent1").toBeTruthy();
			
		}

		button.oncustomevent2 = function(event) {
			expect(event.type=="customevent2").toBeTruthy();
			expect(event.detail).toBeTruthy();
			expect(event.detail.test).toBe(1);
			done();
		}

		button.on(['customevent1', 'customevent2']);
		button.fire('customevent1');
		button.fire('customevent2', {detail: {test:1}});

	});

	it('off, delegate', function(done) {
		let count = 0;
		button.oncustomevent1 = function(event) {
			expect(event.type=="customevent1").toBeTruthy();
			count++;
		}

		button.on('customevent1', button, window);
		window.dispatchEvent(new CustomEvent('customevent1', {detail: 1}));
		button.off('customevent1', button, window);
		window.dispatchEvent(new CustomEvent('customevent1', {detail: 1}));
		setTimeout(function() {
			expect(count).toBe(1);
			done();
		});
	});


	afterEach(function() {
		if (button.parentElement) {
			button.parentElement.removeChild(button);
		}
		button = null;
	})
});
