describe("service", function () {
	var myService,
		Service = window.serviceM.default;

	it('can be called with parameters', function() {
		expect(typeof Service).toBe('function');
		var calls = 0;
		var executor = function(params, resolve, reject) {
			calls++;
			resolve(params); // resolve with params
		}
		myService = new Service(executor);
		var prom = myService.get({param1: 1});
		expect(prom instanceof Promise).toBeTruthy();
		prom.then(function(data) {
			expect(data.param1).toBe(1);
		});

		var prom = myService.get({param1: 2});
		prom.then(function(data) {
			expect(data.param1).toBe(2);
		});
	});

	it('can be rejected', function() {
		var executor = function(params, resolve, reject) {
			reject(new Error('My error'));
		}
		myService = new Service(executor);
		var prom = myService.get({param1:1});
		prom.catch(function(err) {
			expect(err instanceof Error).toBeTruthy();
		});
	})
});