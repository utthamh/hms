describe("Store", function () {
	var Store = window.storeM.default;

	it('Can create stores', function() {
		expect(typeof Store).toBe('function');
		myStore = new Store();
		myStore.setItem('test',1);
		expect(myStore.getItem('test')).toBe(1);
		expect(myStore.getItem('someitem')).toBeUndefined();
		expect(myStore.removeItem('test'));
		expect(myStore.getItem('test')).toBeUndefined(1);
	});

	it('Can store items for a limited time', function(done) {
		myStore = new Store();
		myStore.setItem('test', 1, 0.1); // Store for 0.1 sec or 100ms
		expect(myStore.getItem('test', true)).toBe(1);
		setTimeout(function() {
			expect(myStore.getItem('test', true)).toBeNull();
			done();
		},110); // > 100ms
	})

});