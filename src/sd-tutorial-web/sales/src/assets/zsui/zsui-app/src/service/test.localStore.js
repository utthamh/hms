describe("LocalStore", function () {
	var LocalStore = window.localStoreM.default;
	var Store = window.storeM.default;

	it('Can create stores to use Local Storage', function() {
		expect(typeof LocalStore).toBe('function');
		myStore = new LocalStore();
		expect(myStore instanceof Store).toBeTruthy();
		myStore.setItem('test',1);
		expect(myStore.getItem('test')).toBe(1);
		expect(myStore.getItem('someitem')).toBeNull();
		expect(myStore.removeItem('test'));
		expect(myStore.getItem('test')).toBeNull(1);
		
	});

	it('Verify if storage is available', function() {
		myStore = new LocalStore();
		expect(myStore.isReady).toBeTruthy();
	});

	it('Can encrypt and decrypt values', function() {
		myStore = new LocalStore();
		myStore.encrypt = function(value) {return '1';}
		myStore.decrypt = function(value) {return 2;}
		myStore.setItem('test', 5);
		expect(localStorage.getItem('test')).toBe('1');
		expect(myStore.getItem('test')).toBe(2);
	});

	it('Can store items for a limited time', function(done) {
		myStore = new LocalStore();
		myStore.setItem('test', 1, 0.1); // Store for 0.1 sec or 100ms
		expect(myStore.getItem('test', true)).toBe(1);
		setTimeout(function() {
			expect(myStore.getItem('test', true)).toBeNull();
			done();
		},110); // > 100ms
	});
});