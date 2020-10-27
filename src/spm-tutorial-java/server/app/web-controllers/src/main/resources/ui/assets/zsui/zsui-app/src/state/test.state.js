
describe("state management", function () {
	var State = window.stateM.State, StateManager = window.stateM.StateManager,
		stateManager,
		url;
		results = {};

	beforeEach(function() {
		url = window.location.href;
	})
	afterEach(function() {
		if (stateManager) {stateManager.cleanUp();}
		stateManager = null;
		if (window.location.href != url) {
			//window.location.href = url; // Causing an endless refresh loop
		}
	});

	describe('State', function() {		
		it('class of state objects', function() {
			expect(typeof State).toBe('function');
			var state = new State();
			expect(state instanceof URLSearchParams).toBeTruthy();
			expect(state.toString()).toBe('');
		});

		it('can reflect a plain object', function() {
			var state = new State({num: 1, str: 'str', bool: true, foo: function() {}, obj: {test:1}});			
			expect(state.get('num')).toBe('1');
			expect(state.get('str')).toBe('str');
			expect(state.get('bool')).toBe('true');
			expect(state.get('obj')).toBeTruthy(); // `[object Object]`
			expect(state.get('foo')).toBeTruthy(); // `function() {...}`
		})

		it('can be updated with an object', function() {
			var state = new State('param1=1&param2=2&param3=3');
			expect(typeof state.update).toBe('function');
			state.update({param1:2,param4:4});
			expect(state.toString()).toBe('param1=2&param2=2&param3=3&param4=4');
		});

		it('can compare two state objects', function() {			
			var state = new State('param1=1&param2=2&param3=3');
			expect(typeof state.diff).toBe('function');
			var newState = new State('param1=2&param4=4&param2=2');
			var diff = state.diff(newState);
			expect(typeof diff).toBe('object');
			expect(diff.newKeys.join(',')).toBe('param4');
			expect(diff.changedKeys.join(',')).toBe('param1,param3,param4');
			expect(diff.deletedKeys.join(',')).toBe('param3');
			expect(diff.editedKeys.join(',')).toBe('param1');			

			var state = new State('param1=1&param2=2&param3=3');
			expect(typeof state.isEqual).toBe('function');
			var state2 = new State(state);
			expect(state.isEqual(state2)).toBeTruthy();
			state2.delete('param1');
			expect(state.isEqual(state2)).toBeFalsy();
			state2.set('param1', 1);
			expect(state.isEqual(state2)).toBeTruthy();

		});

		it('can return a plain object', function() {
			var state = new State('param1=1&param2=2&param3=3');
			expect(typeof state.toPlainObject).toBe('function');
			var obj = state.toPlainObject();
			expect(obj.param1).toBe('1');
			expect(obj.param2).toBe('2');
			expect(obj.param3).toBe('3');
		});

		it('can be updated with a plain object', function() {
			var state = new State('param1=1&param2=2&param3=3');
			expect(typeof state.update).toBe('function');
			state.update({param1: 11, param4: 4});
			expect(state.toString()).toBe('param1=11&param2=2&param3=3&param4=4');
		});		
	});
	

	
	it('Can be initialized from the plain object ', function () {
		stateManager = new StateManager({test:1});

		expect(stateManager.state instanceof URLSearchParams).toBeTruthy();
		expect(stateManager.state.get('test')).toBe('1');

	});

	it('Can be initialized from the State instance', function () {
		stateManager = new StateManager(new State({test:1}));

		expect(stateManager.state instanceof URLSearchParams).toBeTruthy();
		expect(stateManager.state.get('test')).toBe('1');
		
		// State shouldn't impact hash and pathname of the url if it doesn't provide them
		var currentUrl = new URL(window.location.href);
		expect(stateManager.url.hash).toBe(currentUrl.hash);
		expect(stateManager.url.pathname).toBe(currentUrl.pathname);

	});

	it('Can be initialized from the URL string', function () {
		var url = 'http://localhost:89/test.html?search=1#hash';
		stateManager = new StateManager(url);
		expect(stateManager.url instanceof URL).toBeTruthy();
		expect(stateManager.url.href).toBe(url);
		expect(stateManager.state instanceof URLSearchParams).toBeTruthy();
		expect(stateManager.state.get('search')).toBe('1');
	});

	
	it('Can update the state and fires `statechange` event', function (done) {
		var calls = 0;
		function onstatechange(event) {
			calls++;
			expect(event.detail).toBeTruthy();
			expect(event.detail.newState instanceof URLSearchParams).toBeTruthy();
			expect(event.detail.stateManager).toBeTruthy();
			if (calls == 1) {
				// No changes first time 
				expect(typeof event.detail.diff).toBe('object');
				expect(event.detail.diff.changedKeys.length).toBeTruthy();
			}
			window.removeEventListener('statechange', onstatechange);
			done();
			
			// TODO: problem of spec being a part of URL and Jasmine using it as a trigger.
			/*
			expect(event.detail.newState instanceof State).toBeTruthy();						
			if (calls == 2) {
				expect(event.detail.newState.get('hash')).toBe('#test123');				
				done();
			}*/
			
			
		}
		window.addEventListener('statechange', onstatechange);
		stateManager = new StateManager(window.location.href);

		//stateManager.update({ hash: '#test123'});
	});

	it('Keeps URL and State in sync', function() {
		var url = 'http://localhost:89/test.html?search=1#hash';
		stateManager = new StateManager(url);
		stateManager.onstatechange = function(){}; // block state change event
		expect(stateManager.state.get('search')).toBe('1');
		expect(stateManager.state.get('hash')).toBe('#hash');
		expect(stateManager.state.get('pathname')).toBe('/test.html');		
		stateManager.update({search:2, new:1});
		expect(stateManager.url.search).toBe('?search=2&new=1');
	});

	it('Exposes APIs how to reflect state in URL and vice versa', function() {
		
		var url = 'http://localhost:89/test.html#param1=1&param2=2';
		stateManager = new StateManager();
		stateManager.onstatechange = function(){}; // block state change event
		expect(typeof stateManager.urlToState).toBe('function');
		expect(typeof stateManager.urlToState).toBe('function');
		
		// Use hash instead of search now
		stateManager.urlToState = function(url) {
			return new State(url.hash.replace('#',''));
		}		
		stateManager.stateToUrl = function(state) {
			var newUrl = this.url || new URL(url);
			newUrl.hash = state.toString();
			return newUrl;
		}
		stateManager.url = new URL(url);
		stateManager.update({param1: 3});

		expect(stateManager.url.hash).toBe('#param1=3&param2=2');
	});

	it('Listens to hashchange', function(done) {
		window.location.hash = '';
		stateManager = new StateManager(window.location.href);
		var calls = 0;
		stateManager.onstatechange = function() {
			calls++;
			expect(this.state.get('hash')).toBe('#test123');			
			setTimeout(function() {
				expect(calls).toBe(1);
				done();
				window.location.hash = '';
			},100);			
		}
		window.location.hash = '#test123';
	});


	it('Listens to popstate', function(done) {
		window.location.hash = '';

		// Push few state to history
		stateManager = new StateManager(window.location.href);
		stateManager.update({hash: '#state1'});
		stateManager.update({hash: '#state2'});

		var calls = 0;
		stateManager.onstatechange = function() { // TODO: this is being called 3 times
			calls++;
			expect(this.state.get('hash')).toBe('#state1');			
			setTimeout(function() {
				expect(calls).toBe(1);
				done();
			},100);			
		}
		history.go(-1);
	});

});
