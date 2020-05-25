
describe('zsAnimate', function () {
	var el;

	it('is a behavior', function () {
		utils.isBehavior(expect, zs.animate);
	});

	

	describe('zs.transition', function () {
		it('is a prototype of a transition', function() {
			expect(typeof zs.transition).toBe('object');
			var obj = Object.create(zs.transition);
			expect(obj.before).toBeNull();
			expect(obj.after).toBeNull();
			expect(obj.reset).toBeNull();
		});
	});


	describe('zs.animation', function () {
		it('is a prototype of an animation', function() {
			expect(typeof zs.animation).toBe('object');
			var obj = Object.create(zs.animation);
			
			// Test only major properties
			expect(obj.promise).toBeNull();
			expect(obj.duration).toBe(0);
			expect(typeof obj.definedTransitions).toBe('object');

		});

		it('can register and share transitions', function() {
			var obj = Object.create(zs.animation);
			var obj2 = Object.create(zs.animation);

			expect(typeof obj.registerTransition).toBe('function');

			var transition = obj.registerTransition('test', {before: {test1:1}, after: {test2: 2}, reset: {test3: 3}});

			expect(transition.__proto__).toBe(zs.transition);
			expect(obj2.definedTransitions['test']).toBe(transition);
			expect(transition.before.test1).toBe(1);
			expect(transition.after.test2).toBe(2);
			expect(transition.reset.test3).toBe(3);
		});

		
		
	});
});

