describe("Select component", function () {
    var elm;
    beforeEach(function (done) {
        elm = document.createElement('div',{is:'zs-select'});
        setTimeout(function () {
            done();
        }, 10); // IE11 requires delay, 0 ms - 5 ms doesn't work, weird 

    });
    it('should be a custom element', function () {
        utils.isBehavior(expect, zs.select);
        utils.isCustomElement(expect, 'zs-select', 'div', zs.selectElement, HTMLDivElement);
    });

    it('should call zsSearchDropdown if appropriate parameter exists', function () {
        elm.setAttribute('searchableDropdown', '');
        elm.appendChild(document.createElement('select'));
        elm.classList.add("zs-select");

        var event = document.createEvent("CustomEvent");
        event.initEvent("attach", true, true);
        elm.dispatchEvent(event);

        expect(elm.querySelectorAll('.zs-search-dropdown').length).toEqual(1);
    });

    it('should not call zsSearchDropdown if appropriate parameter is absent', function () {
        elm.appendChild(document.createElement('select'));

        var event = document.createEvent("CustomEvent");
        event.initEvent("attach", true, true);
        elm.dispatchEvent(event);

        expect(elm.querySelectorAll('.zs-search-dropdown').length).toEqual(0);
    });



});