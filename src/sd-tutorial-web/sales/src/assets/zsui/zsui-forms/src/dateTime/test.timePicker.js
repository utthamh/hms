describe("zsTimePicker component", function () {
	beforeEach(function () {
		timePickerEl = document.createElement('div',{is:'zs-time-picker-field'});
	});

	it('is a custom element', function () {
		utils.isBehavior(expect, zs.timePicker);
		utils.isCustomElement(expect, 'zs-time-picker-field', 'div', zs.timePickerElement, HTMLDivElement);
	});

	it('can be configured with min and max time value', function () {
		timePickerEl.min = "12:30AM";
		timePickerEl.max = "12:30PM";
		timePickerEl.value = "11:00AM"
		document.body.appendChild(timePickerEl);

		expect(timePickerEl.value).toEqual("11:00am");

		timePickerEl.value = "12:00AM";

		expect(timePickerEl.value).toEqual("11:00am");
	});

	it('can be configured to show time values in 24 hour format', function () {
		timePickerEl.format24 = true;
		timePickerEl.value = "8:00PM";
		document.body.appendChild(timePickerEl);

		expect(timePickerEl.value).toEqual("20:00");
	});

	it('can be configured to generate time list as per specified interval', function (done) {
		timePickerEl.step = "30";
		document.body.appendChild(timePickerEl);

		setTimeout(function () {
			expect(timePickerEl.menuContainer.querySelector("a[value='0']")).toBeTruthy();
			expect(timePickerEl.menuContainer.querySelector("a[value='1800']")).toBeTruthy();
			expect(timePickerEl.menuContainer.querySelector("a[value='2700']")).toBeFalsy();
			done();
		}, 0);

	});

	it('auto focuses on entered time value on input field click', function (done) {
		timePickerEl.value = "12:00pm";
		document.body.appendChild(timePickerEl);

		setTimeout(function () {
			timePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));
			expect(timePickerEl.menuContainer.querySelector("[active]")).toBeTruthy();
			expect(timePickerEl.menuContainer.querySelector("[active]").innerText).toEqual("12:00pm");
			done();
		}, 0);
	});

	it('searches through list and highlights relevant option while typing on field', function (done) {
		timePickerEl.format24 = true;
		timePickerEl.value = "7:00am";

		document.body.appendChild(timePickerEl);

		setTimeout(function () {
			expect(timePickerEl.menuContainer.querySelector("[hover]")).toBeFalsy();

			timePickerEl.fieldElement.value = "20";
			timePickerEl.fieldElement.dispatchEvent(new CustomEvent("input"));

			expect(timePickerEl.menuContainer.querySelector("[hover]")).toBeTruthy();
			expect(timePickerEl.menuContainer.querySelector("[hover]").innerText).toEqual("20:00");
			done();
		}, 0);
	});

	it('triggers onChange callback function when time value changes', function () {
		timePickerEl = document.createElement('div',{is:'zs-time-picker-field'});
		timePickerEl.value = "12:30PM";
		timePickerEl.onChange = function () {
			console.log("Time value changed: ", this.value);
		}

		spyOn(timePickerEl, 'onChange').and.callThrough();

		document.body.appendChild(timePickerEl);

		timePickerEl.value = "1:00am"

		expect(timePickerEl.onChange).toHaveBeenCalled();
	});

	afterEach(function () {
		var el = document.querySelector("[is='zs-time-picker-field']");
		if (el) {
			document.body.removeChild(el);
		}
		timePickerEl = null;
	});

});