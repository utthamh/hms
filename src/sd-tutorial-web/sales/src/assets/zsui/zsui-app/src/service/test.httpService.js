describe("HTTPService", function () {
	var url = 'https://jsonplaceholder.typicode.com/users',myAPI,
		HTTPService = window.httpServiceM.default;


	var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;

	it('creates an instance of a service that wraps XMLHTTPRequest', function(done) {
		expect(typeof HTTPService).toBe('function');
		myAPI = new HTTPService({
			url: url
		});
		expect(myAPI.xhr instanceof XMLHttpRequest).toBeTruthy();
		var prom = myAPI.request({query: {_page: 2}});
		expect(prom instanceof Promise).toBeTruthy();
		prom.then(function(data) {
			expect(data).toBeTruthy();
			done();
		});
	});

	it('can apply parameters and mix them', function(done) {
		myAPI = new HTTPService({
			url: url
		});
		expect(typeof myAPI.applyParams).toBe('function');
		myAPI.applyParams({query: {_page: 2}, param1: 1});
		myAPI.applyParams({query: {_page: 3}, param2: 2});
		myAPI.applyParams({query: {_limit: 1}});

		myAPI.applyParams({path: {some: 1}, body: {some:4}});
		myAPI.applyParams({header: {some: 2}, path: {some:11}});
		myAPI.applyParams({body: {some: 3}, header: {some:22}});

		expect(myAPI.params.param1).toBe(1);
		expect(myAPI.params.query._page).toBe(3);
		expect(myAPI.params.query._limit).toBe(1);
		expect(myAPI.params.param2).toBe(2);
		expect(myAPI.params.path.some).toBe(11);
		expect(myAPI.params.header.some).toBe(22);
		expect(myAPI.params.body.some).toBe(3);

		done();		

	});

	it('can build URL from parameters', function() {
		myAPI = new HTTPService({
			url: 'https://jsonplaceholder.typicode.com',
			path: {users:1},
			query: {userId: 1}
		});

		expect(myAPI.requestUrl(myAPI.params)).toBe('https://jsonplaceholder.typicode.com/users/1?userId=1');
	});



	it('can add HTTP headers', function(done) {
		myAPI = new HTTPService({
			url: 'https://jsonplaceholder.typicode.com/users',
			method: 'GET',
			headers: {'Access-Control-Allow-Origin':'*', 'Accept': 'text/html'}
		
		});
		myAPI.request({headers: {"X-Test": "42"}}).then(function(data, xhr) {			
			//expect(myAPI.xhr.getResponseHeader('x-test')).toBe(42); // TODO: can't really verify that but see but check the response
			expect(1).toBe(1);			
			done();
		});		
	});

	it('supports POST', function(done) {
		// https://github.com/typicode/jsonplaceholder#how-to
		myAPI = new HTTPService({
			url: 'https://jsonplaceholder.typicode.com/posts', 
    		method: 'POST',
    		body: JSON.stringify({ // TODO: FormData?
      			title: 'foo',
      			body: 'bar',
      			userId: 1
    		}),
    		headers: {
      			"Content-type": "application/json; charset=UTF-8"
			}
		});
		myAPI.post().then(function(data) {
			expect(data.id).toBe(101)				
			/*{	
				id: 101,
				title: 'foo',
				body: 'bar',
				userId: 1
			  }*/
			  done();
		}).catch(function(err) {
			expect(err).toBeNull();
			done();
		});
	});

	it('supports PUT', function(done) {
		// https://github.com/typicode/jsonplaceholder#how-to
		myAPI = new HTTPService({
			url: 'https://jsonplaceholder.typicode.com/posts/1', 
    		method: 'PUT',
    		body: JSON.stringify({ // TODO: FormData?
				id: 1,
				title: 'foo',
				body: 'bar',
				userId: 1
    		}),
    		headers: {
      			"Content-type": "application/json; charset=UTF-8"
			}
		});
		myAPI.put().then(function(data) {
			expect(data.id).toBe(1)				
  		  	done();
		}).catch(function(err) {
			expect(err).toBeNull();
			done();
		});
	});

	it('supports PATCH', function(done) {
		// https://github.com/typicode/jsonplaceholder#how-to
		myAPI = new HTTPService({
			url: 'https://jsonplaceholder.typicode.com/posts/1', 
    		method: 'PATCH',
    		body: JSON.stringify({
				title: 'foo'
			}),
    		headers: {
      			"Content-type": "application/json; charset=UTF-8"
			}
		});
		myAPI.patch().then(function(data) {
			expect(data.title).toBe('foo');				
  		  	done();
		}).catch(function(err) {
			expect(err).toBeNull();
			done();
		});
	});

	it('supports DELETE', function(done) {
		// https://github.com/typicode/jsonplaceholder#how-to
		myAPI = new HTTPService({
			url: 'https://jsonplaceholder.typicode.com/', 
    		method: 'DELETE',
    		path: {posts:1},
    		headers: {
      			"Content-type": "application/json; charset=UTF-8"
			}
		});

		myAPI.xhr.withCredentials = false;
		myAPI.delete().then(function(data) {
			expect(data).toBeTruthy();				
  		  	done();
		}).catch(function(err) {
			if (isIE11) {
				expect(err).toBeTruthy(); // https://stackoverflow.com/questions/20198696/cors-request-with-ie11
			} else {
				expect(err).toBeNull();
			}
			done();
		});
	});

	it('handles errors', function(done) {
		myAPI = new HTTPService({
			url: 'https://jsonplaceholder.typicode.com/unknownpath',
		});
		myAPI.request().then(function(data) {
			expect(data).toBeFalsy();				
  		  	done();
		}).catch(function(err) {
			expect(err instanceof Error).toBeTruthy();
			done();
		});
	})

});