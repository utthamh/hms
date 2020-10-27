describe("dateRangePicker component", function () {
	var rangePickerEl;

	it('is a custom element', function () {
		utils.isBehavior(expect, zs.dateRangePicker);
		utils.isCustomElement(expect, 'zs-date-range-picker', null, zs.dateRangePickerElement, HTMLElement);
	});

	describe('syncs attributes and properties', function () {
		rangePickerEl = document.createElement("zs-date-range-picker");

		it('maxRange', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");
			utils.isPropAttrSync(expect, done, rangePickerEl, 'maxRange', 'string');
		});

		it('endRange', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");
			utils.isPropAttrSync(expect, done, rangePickerEl, 'endRange', 'string');
		});

		it('startRange', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");
			utils.isPropAttrSync(expect, done, rangePickerEl, 'startRange', 'string');
		});

		it('endRange', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");
			utils.isPropAttrSync(expect, done, rangePickerEl, 'endRange', 'string');
		});

		it('locale', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");
			utils.isPropAttrSync(expect, done, rangePickerEl, 'locale', 'string');
		});
	});

	it('can be created from markup', function (done) {
		document.body.innerHTML += '<zs-date-range-picker class="zs-date-range-picker zs-paragraph" min-range="12-2016" max-range="08-2020" start-range="05-2018" end-range="05-2019"></zs-date-range-picker>';

		rangePickerEl = document.querySelector("zs-date-range-picker");

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {
			expect(rangePickerEl.maxRange).toEqual("08-2020");
			expect(rangePickerEl.fieldElement).toBeTruthy();
			expect(rangePickerEl.rangeContainer).toBeTruthy();
			done();
		}, 100);
	});

	it('can be created from javascript', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {
			expect(rangePickerEl.minRange).toEqual("01-" + new Date().getFullYear());
			expect(rangePickerEl.maxRange).toEqual("12-" + (new Date().getFullYear() + 1));
			done();
		}, 100);
	});

	it('open the calendar after focusing or clicking on input field', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {
			expect(rangePickerEl.fieldElement).toBeTruthy();
			expect(rangePickerEl.rangeContainer).toBeTruthy();
			expect(rangePickerEl.rangeContainer.style.display).toEqual("none");

			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			expect(rangePickerEl.rangeContainer.style.display).toEqual("block");

			document.body.click();

			expect(rangePickerEl.rangeContainer.style.display).toEqual("none");

			rangePickerEl.calendarIcon.click()

			expect(rangePickerEl.rangeContainer.style.display).toEqual("block");

			done();
		}, 100);
	});

	it('can be configured with min and max selectable date ranges specified in MM-YYYY format', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");
		rangePickerEl.minRange = "01-2017";
		rangePickerEl.maxRange = "10-2021";

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {
			expect(rangePickerEl.prevYear).toEqual(new Date().getFullYear());
			expect(rangePickerEl.nextYear).toEqual(new Date().getFullYear() + 1);

			rangePickerEl.minRange = "01-2017";
			rangePickerEl.maxRange = "10-2019";

			expect(rangePickerEl.prevYear).toEqual(2018);
			expect(rangePickerEl.nextYear).toEqual(2019);

			done();
		}, 100);
	});

	it('can be configured with pre-selected date range by setting startRange and endRange properties in MM-YYYY format', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");
		rangePickerEl.startRange = "05-2017";
		rangePickerEl.endRange = "10-2019";

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {

			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			expect(rangePickerEl.prevYear).toEqual(2017);
			expect(rangePickerEl.nextYear).toEqual(2018);

			expect(rangePickerEl.minRange).toEqual("01-2017");
			expect(rangePickerEl.maxRange).toEqual("12-" + (new Date().getFullYear() + 1));

			expect(rangePickerEl.prevTable.querySelectorAll("[current]").length).toEqual(8);
			expect(rangePickerEl.nextTable.querySelectorAll("[current]").length).toEqual(12);

			rangePickerEl.nextBtn.dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.prevYear).toEqual(2018);
			expect(rangePickerEl.nextYear).toEqual(2019);

			expect(rangePickerEl.prevTable.querySelectorAll("[current]").length).toEqual(12);
			expect(rangePickerEl.nextTable.querySelectorAll("[current]").length).toEqual(10);

			rangePickerEl.nextBtn.dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.prevTable.querySelectorAll("[current]").length).toEqual(10);
			expect(rangePickerEl.nextTable.querySelectorAll("[current]").length).toEqual(0);

			done();
		}, 100);
	});

	it('disables months lying outside min-max range from being selected', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");
		rangePickerEl.minRange = "05-2017";
		rangePickerEl.startRange = "08-2017";
		rangePickerEl.endRange = "8-2018";
		rangePickerEl.maxRange = "10-2018";

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {

			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			rangePickerEl.prevBtn.dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.prevYear).toEqual(2017);
			expect(rangePickerEl.nextYear).toEqual(2018);

			expect(rangePickerEl.prevTable.querySelectorAll("[disabled]").length).toEqual(4);
			expect(rangePickerEl.nextTable.querySelectorAll("[disabled]").length).toEqual(2);

			// Selectable months
			expect(rangePickerEl.prevTable.querySelectorAll("[date]:not([current]):not([disabled])").length).toEqual(3);
			expect(rangePickerEl.nextTable.querySelectorAll("[date]:not([current]):not([disabled])").length).toEqual(2);

			done();
		}, 100);
	});

	it('disables/enables prev/next link buttons as per range displayed in current viewport', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");
		document.body.appendChild(rangePickerEl);


		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {

			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			spyOn(rangePickerEl, 'prevBtnClickHandler').and.callThrough();
			spyOn(rangePickerEl, 'nextBtnClickHandler').and.callThrough();

			expect(rangePickerEl.prevBtn.hasAttribute("disabled")).toEqual(true);
			expect(rangePickerEl.nextBtn.hasAttribute("disabled")).toEqual(true);


			rangePickerEl.minRange = "05-2014";
			rangePickerEl.startRange = "08-2017";
			rangePickerEl.endRange = "8-2018";
			rangePickerEl.maxRange = "10-2018";

			expect(rangePickerEl.prevYear).toEqual(2017);
			expect(rangePickerEl.nextYear).toEqual(2018);

			expect(rangePickerEl.nextBtn.hasAttribute("disabled")).toEqual(true);
			expect(rangePickerEl.prevBtn.hasAttribute("disabled")).toEqual(false);;

			rangePickerEl.prevBtn.dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.prevBtnClickHandler).toHaveBeenCalled();

			expect(rangePickerEl.nextBtn.hasAttribute("disabled")).toEqual(false);

			expect(rangePickerEl.prevYear).toEqual(2016);
			expect(rangePickerEl.nextYear).toEqual(2017);

			rangePickerEl.nextBtn.dispatchEvent(new CustomEvent("click"));
			expect(rangePickerEl.nextBtn.hasAttribute("disabled")).toEqual(true);

			expect(rangePickerEl.nextBtnClickHandler).toHaveBeenCalled();

			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			while (!rangePickerEl.prevBtn.hasAttribute("disabled")) {
				rangePickerEl.prevBtn.dispatchEvent(new CustomEvent("click"));
			}

			expect(rangePickerEl.prevYear).toEqual(2014);
			expect(rangePickerEl.nextYear).toEqual(2015);

			expect(rangePickerEl.nextBtn.hasAttribute("disabled")).toEqual(false);

			rangePickerEl.nextBtn.dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.nextBtn.hasAttribute("disabled")).toEqual(false);
			expect(rangePickerEl.prevBtn.hasAttribute("disabled")).toEqual(false);

			done();
		}, 100);
	});

	it('generates and displays months as per locale specified', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");
		rangePickerEl.locale = "fr";
		rangePickerEl.maxRange = "10-2018";

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {

			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			expect(rangePickerEl.prevYear).toEqual(2017);
			expect(rangePickerEl.nextYear).toEqual(2018);

			expect(rangePickerEl.rangeContainer.querySelector("[date='6-2018']").innerText.replace(/[^ -~]/g, '')).toBe("juin");

			rangePickerEl.locale = "en";

			expect(rangePickerEl.rangeContainer.querySelector("[date='6-2018']").innerText.replace(/[^ -~]/g, '')).toBe("Jun");

			done();
		}, 100);
	});

	describe("fires appropriate events", function () {

		it('fires "change" event while closing the calendar after range selection', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");
			rangePickerEl.minRange = "05-2014";
			rangePickerEl.startRange = "08-2017";
			rangePickerEl.endRange = "8-2018";
			rangePickerEl.maxRange = "10-2018";

			document.body.appendChild(rangePickerEl);

			expect(rangePickerEl).toBeTruthy();

			setTimeout(function () {
				rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

				rangePickerEl.prevBtn.dispatchEvent(new CustomEvent("click"));

				expect(rangePickerEl.prevYear).toEqual(2016);
				expect(rangePickerEl.nextYear).toEqual(2017);

				// Change current selection
				rangePickerEl.rangeContainer.querySelector("[date='5-2016']").dispatchEvent(new CustomEvent("click"));

				rangePickerEl.addEventListener("change", function (e) {
					expect(e.detail.newRange.startDate.month).toEqual(5);
					expect(e.detail.oldRange.startDate.year).toEqual(2017);
					expect(e.detail.oldRange.startDate.month).toEqual(8);
					expect(e.detail.newRange.startDate.year).toEqual(2016);

					expect(e.detail.newRange.endDate.month).toEqual(5);
					expect(e.detail.oldRange.endDate.year).toEqual(2018);
					expect(e.detail.oldRange.endDate.month).toEqual(8);
					expect(e.detail.newRange.endDate.year).toEqual(2017);

					setTimeout(function () {
						done();
					}, 100);
				});

				rangePickerEl.rangeContainer.querySelector("[date='5-2017']").dispatchEvent(new CustomEvent("click"));

				document.body.click();

			}, 100);
		});

		it('fires "beforeOpen" event while opening the calendar', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");

			document.body.appendChild(rangePickerEl);

			expect(rangePickerEl).toBeTruthy();

			setTimeout(function () {

				rangePickerEl.addEventListener("beforeOpen", function (e) {
					setTimeout(function () {
						done();
					}, 100);
				});

				rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			}, 100);
		});

		it('fires "open" event after opening the calendar', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");

			document.body.appendChild(rangePickerEl);

			expect(rangePickerEl).toBeTruthy();

			setTimeout(function () {

				rangePickerEl.addEventListener("open", function (e) {
					setTimeout(function () {
						done();
					}, 100);
				});

				rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			}, 100);
		});

		it('fires "beforeClose" event while closing the calendar', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");

			document.body.appendChild(rangePickerEl);

			expect(rangePickerEl).toBeTruthy();


			setTimeout(function () {
				rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

				rangePickerEl.addEventListener("beforeClose", function (e) {
					setTimeout(function () {
						done();
					}, 100);
				});

				document.body.click();

			}, 100);
		});

		it('fires "close" event after closing the calendar', function (done) {
			rangePickerEl = document.createElement("zs-date-range-picker");

			document.body.appendChild(rangePickerEl);

			expect(rangePickerEl).toBeTruthy();


			setTimeout(function () {
				rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

				rangePickerEl.addEventListener("close", function (e) {
					setTimeout(function () {
						done();
					}, 100);
				});

				document.body.click();

			}, 100);
		});

	});

	it('clears the input field text upon pressing "Clear" button', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");

		rangePickerEl.minRange = "05-2014";
		rangePickerEl.startRange = "08-2017";
		rangePickerEl.endRange = "8-2018";
		rangePickerEl.maxRange = "10-2018";

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {
			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));
			expect(rangePickerEl.clearBtn).toBeTruthy();
			expect(rangePickerEl.fieldElement.value.length).toBeGreaterThan(0);

			rangePickerEl.clearBtn.dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.fieldElement.value.length).toEqual(0);

			done();
		}, 100);
	});

	it('has overridable "updateFieldText()" function that sets input field text value upon range selection', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");

		rangePickerEl.minRange = "05-2014";
		rangePickerEl.startRange = "08-2017";
		rangePickerEl.endRange = "8-2018";
		rangePickerEl.maxRange = "10-2018";

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {
			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			expect(rangePickerEl.fieldElement.value.replace(/[^ -~]/g, '')).toEqual("Aug 2017 - Aug 2018");

			rangePickerEl.rangeContainer.querySelector("[date='5-2017']").dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.fieldElement.value.replace(/[^ -~]/g, '')).toEqual("May 2017 - May 2017");

			rangePickerEl.updateFieldText = function () {
				this.fieldElement.value = "Hello World";
				return this;
			}

			rangePickerEl.rangeContainer.querySelector("[date='6-2017']").dispatchEvent(new CustomEvent("click"));

			expect(rangePickerEl.fieldElement.value).toEqual("Hello World");

			document.body.click();

			setTimeout(function () {
				expect(rangePickerEl.startRange).toEqual("5-2017");
				expect(rangePickerEl.endRange).toEqual("6-2017");
				expect(rangePickerEl.fieldElement.value).toEqual("Hello World");
				done();
			}, 100);

		}, 100);
	});

	xit('positions the calendar appropriately so thats it sticks to the bottom of the input field', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");

		document.body.appendChild(rangePickerEl);

		expect(rangePickerEl).toBeTruthy();

		setTimeout(function () {
			rangePickerEl.offsetLeft = 100;
			rangePickerEl.offsetTop = 100;

			rangePickerEl.fieldElement.dispatchEvent(new CustomEvent("focus"));

			var rect = rangePickerEl.fieldElement.getBoundingClientRect();
			expect(rangePickerEl.rangeContainer.offsetLeft).toBeCloseTo(parseInt(rect.left), -2);

			expect(parseInt(rect.top + rect.height)).toBeCloseTo(rangePickerEl.rangeContainer.offsetTop, -2);

			done();

		}, 100);
	});

	it('performs self cleanup upon detach', function (done) {
		rangePickerEl = document.createElement("zs-date-range-picker");

		document.body.appendChild(rangePickerEl);

		setTimeout(function () {
			expect(rangePickerEl.rangeContainer).toBeTruthy();
			expect(rangePickerEl.rangeContainer.innerHTML.length).toBeGreaterThan(0);

			rangePickerEl.parentElement && rangePickerEl.parentElement.removeChild(rangePickerEl);

			setTimeout(function () {
				expect(rangePickerEl.innerHTML.length).toEqual(0);
				expect(rangePickerEl.rangeContainer).toEqual(null);
				expect(rangePickerEl.fieldElement).toEqual(null);
				done();
			}, 100);

		}, 100);

	});

	afterEach(function () {
		var el = rangePickerEl;
		if (el && el.parentElement) {
			el.parentElement.removeChild(el);
		}
		rangePickerEl = null;
	});

});