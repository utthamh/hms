describe("tooltipElement", function () {
    var elm;
    var delay = 200;
    var testElm;
    
    describe("custom element setup: ", function () {
        beforeEach(function () {
            elm = document.createElement('zs-tooltip');
            document.body.appendChild(elm);
        });

        it('should be a custom element', function (done) {
            setTimeout(function () {
                expect(elm).not.toBe(null);
                done();
            }, delay);
        });

        it('should be renderable', function (done) {
            setTimeout(function () {
                expect(elm.render).toBeDefined();
                done();
            }, delay);
        });

        afterEach(function () {
            document.body.removeChild(elm);
            elm = null;
        });
    });

    describe("public API: ", function () {
        beforeEach(function () {
            elm = document.createElement('zs-tooltip');
            document.body.appendChild(elm);

            testElm = document.createElement('div');
            testElm.setAttribute('id', 'test-element');
            document.body.appendChild(testElm)
        });

        it('should create the component with default properties', function (done) {
            setTimeout(function () {
                
                // converting elm._defaults... to string for fair comparison
                expect(elm['animate-show-with-duration']).toBe(elm._defaults['animate-show-with-duration']);
                expect(elm['animate-hide-with-duration']).toBe(elm._defaults['animate-hide-with-duration']);
                expect(elm['arrow-position']).toBe('' + elm._defaults['arrow-position']);
                expect(elm.for).toBe(elm._defaults.for);
                expect(elm.mode).toBe(elm._defaults.mode);
                expect(elm.norender).toBe(elm._defaults.norender);
                expect(elm['offset-x']).toBe(elm._defaults['offset-x']);
                expect(elm['offset-y']).toBe(elm._defaults['offset-y']);
                expect(elm.position).toBe(elm._defaults.position);
                done();
            }, delay);
        });

        it('should create the component with default attributes', function (done) {
            setTimeout(function () {
                // converting elm._defaults... to string for fair comparison
                expect(elm.getAttribute('animate-show-with-duration')).toBe('' + elm._defaults['animate-show-with-duration']);
                expect(elm.getAttribute('animate-hide-with-duration')).toBe('' + elm._defaults['animate-hide-with-duration']);
                expect(elm.getAttribute('arrow-position')).toBe('' + elm._defaults['arrow-position']);
                expect(elm.getAttribute('for')).toBe('' + elm._defaults.for);
                expect(elm.getAttribute('mode')).toBe('' + elm._defaults.mode);
                expect(elm.getAttribute('norender')).toBe('' + elm._defaults.norender);
                expect(elm.getAttribute('offset-x')).toBe('' + elm._defaults['offset-x']);
                expect(elm.getAttribute('offset-y')).toBe('' + elm._defaults['offset-y']);
                expect(elm.getAttribute('position')).toBe('' + elm._defaults.position);

                done();
            }, delay);
        });

        it('should be possible to customize the component by setting properties', function (done) {
            var animateShowWithDuration = 10;
            var animateHideWithDuration = 20;
            var arrowPosition = 'left';
            var forParam = 'test-element';
            var mode = 'manual';
            var norender = true;
            var offsetX = 10;
            var offsetY = 20;
            var position = 'right';

            elm['animate-show-with-duration'] = animateShowWithDuration;
            elm['animate-hide-with-duration'] = animateHideWithDuration;
            elm['arrow-position'] = arrowPosition;
            elm.for = forParam;
            elm.mode = mode;
            elm.norender = norender;
            elm['offset-x'] = offsetX;
            elm['offset-y'] = offsetY;
            elm.position = position;

            setTimeout(function () {
                expect(elm['animate-show-with-duration']).toBe(animateShowWithDuration);
                expect(elm['animate-hide-with-duration']).toBe(animateHideWithDuration);
                expect(elm['arrow-position']).toBe(arrowPosition);
                expect(elm.for).toBe(forParam);
                expect(elm.mode).toBe(mode);
                expect(elm.norender).toBe(norender);
                expect(elm['offset-x']).toBe(offsetX);
                expect(elm['offset-y']).toBe(offsetY);
                expect(elm.position).toBe(position);

                done();
            }, delay);
        });

        it('should be able to customize the component by setting attributes', function (done) {
            var animateShowWithDuration = 10;
            var animateHideWithDuration = 20;
            var arrowPosition = 'left';
            var forParam = 'test-element';
            var mode = 'manual';
            var norender = true;
            var offsetX = 10;
            var offsetY = 20;
            var position = 'right';


            setTimeout(function () { // wait for init completed
                elm.setAttribute('animate-show-with-duration', animateShowWithDuration);
                elm.setAttribute('animate-hide-with-duration', animateHideWithDuration);
                elm.setAttribute('arrow-position', arrowPosition);
                elm.setAttribute('for', forParam);
                elm.setAttribute('mode', mode);
                elm.setAttribute('norender', norender);
                elm.setAttribute('offset-x', offsetX);
                elm.setAttribute('offset-y', offsetY);
                elm.setAttribute('position', position);


                // converting to string for fair comparison
                expect(elm.getAttribute('animate-show-with-duration')).toBe('' + animateShowWithDuration);
                expect(elm.getAttribute('animate-hide-with-duration')).toBe('' + animateHideWithDuration);
                expect(elm.getAttribute('arrow-position')).toBe('' + arrowPosition);
                expect(elm.getAttribute('for')).toBe('' + forParam);
                expect(elm.getAttribute('mode')).toBe('' + mode);
                expect(elm.getAttribute('norender')).toBe('' + norender);
                expect(elm.getAttribute('offset-x')).toBe('' + offsetX);
                expect(elm.getAttribute('offset-y')).toBe('' + offsetY);
                expect(elm.getAttribute('position')).toBe('' + position);
                done();
            }, delay);
        });

        it('should sync attributes and properties', function (done) {
            var animateShowWithDuration = 10;
            var animateHideWithDuration = 20;
            var arrowPosition = 'left';
            var forParam = '#test-element';
            var mode = 'manual';
            var norender = true;
            var offsetX = 10;
            var offsetY = 20;
            var position = 'right';


            elm.setAttribute('animate-show-with-duration', animateShowWithDuration);
            elm.setAttribute('animate-hide-with-duration', animateHideWithDuration);
            elm.setAttribute('arrow-position', arrowPosition);
            elm.setAttribute('for', forParam);
            elm.setAttribute('mode', mode);
            elm.setAttribute('norender', norender);
            elm.setAttribute('offset-x', offsetX);
            elm.setAttribute('offset-y', offsetY);
            elm.setAttribute('position', position);

            setTimeout(function () { // wait for init completed
                


                // converting to string for fair comparison
                expect('' + elm['animate-show-with-duration']).toBe(elm.getAttribute('animate-show-with-duration'));
                expect('' + elm['animate-hide-with-duration']).toBe(elm.getAttribute('animate-hide-with-duration'));
                expect('' + elm['arrow-position']).toBe(elm.getAttribute('arrow-position'));
                expect('' + elm.for).toBe(elm.getAttribute('for'));
                expect('' + elm.mode).toBe(elm.getAttribute('mode'));
                expect('' + elm.norender).toBe(elm.getAttribute('norender'));
                expect('' + elm['offset-x']).toBe(elm.getAttribute('offset-x'));
                expect('' + elm['offset-y']).toBe(elm.getAttribute('offset-y'));
                expect('' + elm.position).toBe(elm.getAttribute('position'));
                done();
            }, delay);
        });

        it('should fire attach event when attached to dom', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('attach', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);
            
            setTimeout(function () { // wait for init completed
                document.body.removeChild(tooltip);
                expect(eventWasFired).toBeTruthy();
                done();
            }, 1000);
        });

        it('should fire detach event when detach from dom', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('detach', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);
            
            setTimeout(function () { // wait for init completed
                document.body.removeChild(tooltip);
                
                setTimeout(function () {                    
                    expect(eventWasFired).toBeTruthy();
                    done();
                }, delay);

            }, delay);
        });

        it('should fire render event when rendered', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            tooltip.setAttribute('norender', true);
            document.body.appendChild(tooltip);        


            var eventWasFired = false;
            tooltip.addEventListener('render', function() {
                eventWasFired = true;
            });

            tooltip.setAttribute('norender', false);

            setTimeout(function () { // wait for init completed
                
                tooltip.render();

                expect(eventWasFired).toBeTruthy();
                document.body.removeChild(tooltip);  
                done();
            }, delay);
        });

        it('should fire beforerender event before rendered', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            tooltip.setAttribute('norender', true);

            var eventWasFired = false;

            tooltip.addEventListener('beforerender', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);
            tooltip.setAttribute('norender', false);

            setTimeout(function () { // wait for init completed
                tooltip.render();
                expect(eventWasFired).toBeTruthy();

                document.body.removeChild(tooltip);
                done();
            }, delay);
        });

        it('should fire show event when showed', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('show', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                document.body.removeChild(tooltip);
                expect(eventWasFired).toBeTruthy();
                done();
            }, delay);
        });

        it('should fire beforeshow event before shown', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('beforeshow', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);
            
            setTimeout(function () { // wait for init completed
                tooltip.show();
                document.body.removeChild(tooltip);
                expect(eventWasFired).toBeTruthy();
                done();
            }, delay);
        });

        it('should fire hide event when hidden', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('hide', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);

            
            setTimeout(function () { // wait for init completed
                tooltip.hide();

                document.body.removeChild(tooltip);
                expect(eventWasFired).toBeTruthy();
                done();
            }, delay);
        });

        it('should fire beforehide event before hidden', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('beforehide', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);

            
            setTimeout(function () { // wait for init completed
                tooltip.hide();

                document.body.removeChild(tooltip);

                expect(eventWasFired).toBeTruthy();
                done();
            }, delay);
        });

        it('should fire destroy event when destroy', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('destroy', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);
            setTimeout(function () { // wait for init completed
                tooltip.destroy();
                expect(eventWasFired).toBeTruthy();
                done();
            }, delay);
        });

        it('should fire beforedestroy event before destroyed', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            var eventWasFired = false;

            tooltip.addEventListener('beforedestroy', function() {
                eventWasFired = true;
            });

            document.body.appendChild(tooltip);
            
            setTimeout(function () { // wait for init completed
                tooltip.destroy();

                expect(eventWasFired).toBeTruthy();

                done();
            }, delay);
        });

        afterEach(function () {
			return;
            document.body.removeChild(elm);
            document.body.removeChild(testElm);
            elm = null;
            testElm = null;
        });
    });

    describe("anchor setup: ", function () {
        it('should use "for" param as source of anchor', function (done) {
            var anchor = document.createElement('div');
            anchor.setAttribute('id', 'anchor');
            document.body.appendChild(anchor);

            var tooltip = document.createElement('zs-tooltip');
            tooltip.setAttribute('for', 'anchor') 
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed

                expect(tooltip.anchor).toEqual(anchor);
                document.body.removeChild(tooltip);
                document.body.removeChild(anchor);
                done();
            }, delay);
        });

        it('should fallback and use parenNode as anchor if  "for" wasn\'t specified ', function (done) {
            var tooltip = document.createElement('zs-tooltip');
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed

                expect(tooltip.anchor).toEqual(tooltip.parentNode);
                document.body.removeChild(tooltip);
                done();
            }, delay);
        });

        it('should fallback and use parenNode as anchor if wasn\'t able to find element by "for" param', function (done) {
            // Initially, Tooltip checks if there is an anchor when user tries to set 'for'. If not: fallback to parent
            // Hpwever, it may happen that anchor will be removed from DOM between set 'for' and actual render
            
            // Create anchor and add it to DOM
            var anchor = document.createElement('div');
            anchor.classList.add('anchor');
            document.body.appendChild(anchor);

            // Create tooltip and setup in not to render 
            var tooltip = document.createElement('zs-tooltip');
            tooltip.setAttribute('for', '.anchor');
            tooltip.setAttribute('norender', true);
            document.body.appendChild(tooltip);

            // Remove anchor from DOM
            document.body.removeChild(anchor);

            // Render tooltip
            tooltip.setAttribute('norender', false);
            tooltip.render();

            setTimeout(function () { // wait for init completed

                // Now it should fallback to parenNode
                expect(tooltip.anchor).toEqual(tooltip.parentNode);
                document.body.removeChild(tooltip);
                done();
            }, delay);
        });
    });

    describe("show/Hide events: ", function () {
        var anchor, tooltip;
        beforeEach(function () {
            anchor = document.createElement('div');
            anchor.setAttribute('id', 'anchor');
            document.body.appendChild(anchor);

            tooltip = document.createElement('zs-tooltip');
            tooltip.setAttribute('for', 'anchor') 
            document.body.appendChild(tooltip);
        });

        it('should react on click on anchor', function (done) {
            spyOn(tooltip, '_anchorActivated');

            setTimeout(function () { // wait for init completed
                anchor.dispatchEvent(new MouseEvent('click'));

                expect(tooltip._anchorActivated).toHaveBeenCalled();
                done();
            }, delay);
        });

        it('should react on hover on anchor', function (done) {
            spyOn(tooltip, '_anchorActivated');

            setTimeout(function () { // wait for init completed
                anchor.dispatchEvent(new MouseEvent('mouseenter'));

                expect(tooltip._anchorActivated).toHaveBeenCalled();
                done();
            }, delay);
        });
        
        it('should react on mouseleave on anchor', function (done) {
            spyOn(tooltip, '_anchorDeactivated');

            setTimeout(function () { // wait for init completed
                anchor.dispatchEvent(new MouseEvent('mouseleave'));

                expect(tooltip._anchorDeactivated).toHaveBeenCalled();
                done();
            }, delay);
        });

        afterEach(function () {
            document.body.removeChild(tooltip);
            document.body.removeChild(anchor);

            anchor = null;
            tooltip = null;
        });

    });

    describe("different modes, show and hide: ", function () {
        var tooltip;
        beforeEach(function () {
            tooltip = document.createElement('zs-tooltip');
        });

        it('should show tooltip when anchor was activated if mode is "auto"', function (done) {
            tooltip.setAttribute('mode', 'auto');

            document.body.appendChild(tooltip);
            spyOn(tooltip, 'show');

            setTimeout(function () { // wait for init completed
                tooltip._anchorActivated();
                expect(tooltip.show).toHaveBeenCalled();
                done();
            }, delay);
        });

        it('should hide tooltip when anchor was deactivated if mode is "auto"', function (done) {
            tooltip.setAttribute('mode', 'auto');

            document.body.appendChild(tooltip);
            
            spyOn(tooltip, 'hide');

            setTimeout(function () { // wait for init completed
                tooltip.hide();
                tooltip._anchorDeactivated();
                expect(tooltip.hide).toHaveBeenCalled();
                done();
            }, delay);
        });

        it('should NOT show tooltip when anchor was activated if mode is "manual"', function (done) {
            tooltip.setAttribute('mode', 'manual');

            document.body.appendChild(tooltip);
            spyOn(tooltip, 'show');

            setTimeout(function () { // wait for init completed
                tooltip._anchorActivated();
                expect(tooltip.show).not.toHaveBeenCalled();
                done();
            }, delay);
        });

        it('should NOT hide tooltip when anchor was deactivated if mode is "manual"', function (done) {
            tooltip.setAttribute('mode', 'manual');

            document.body.appendChild(tooltip);
            spyOn(tooltip, 'hide');

            setTimeout(function () { // wait for init completed
                tooltip._anchorDeactivated();
                expect(tooltip.hide).not.toHaveBeenCalled();
                done();
            }, delay);
        });


        afterEach(function () {
            document.body.removeChild(tooltip);
            tooltip = null;
        });

    });

    describe("arrow: ", function () {
        var tooltip;
        beforeEach(function () {
            tooltip = document.createElement('zs-tooltip');
        });

        it('should support disabling arrow', function (done) {
            tooltip.setAttribute('arrow-position', 'none');
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                expect(tooltip.querySelector('zs-tooltip-arrow')).toBe(null);
                done();
            }, delay);
        });

        it('should support auto position of arrow', function (done) {
            tooltip.setAttribute('arrow-position', 'auto');
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                expect(tooltip.querySelector('zs-tooltip-arrow')).not.toBe(null);
                done();
            }, delay);
        });

        it('should support left position of arrow', function (done) {
            var position = 'left';
            tooltip.setAttribute('arrow-position', position);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                var arrow = tooltip.querySelector('zs-tooltip-arrow');
                expect(arrow).not.toBe(null);
                expect(arrow.classList.contains(position)).toBeTruthy();
                done();
            }, delay);
        });

        it('should support top position of arrow', function (done) {
            var position = 'top';
            tooltip.setAttribute('arrow-position', position);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                var arrow = tooltip.querySelector('zs-tooltip-arrow');
                expect(arrow).not.toBe(null);
                expect(arrow.classList.contains(position)).toBeTruthy();
                done();
            }, delay);
        });

        it('should support right position of arrow', function (done) {
            var position = 'right';
            tooltip.setAttribute('arrow-position', position);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                var arrow = tooltip.querySelector('zs-tooltip-arrow');
                expect(arrow).not.toBe(null);
                expect(arrow.classList.contains(position)).toBeTruthy();
                done();
            }, delay);
        });

        it('should support bottom position of arrow', function (done) {
            var position = 'bottom';
            tooltip.setAttribute('arrow-position', position);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                var arrow = tooltip.querySelector('zs-tooltip-arrow');
                expect(arrow).not.toBe(null);
                expect(arrow.classList.contains(position)).toBeTruthy();
                done();
            }, delay);
        });

        afterEach(function () {
            document.body.removeChild(tooltip);
            tooltip = null;
        });
    });

    describe("position: ", function () {
        var offset = 10;
        var tooltip, anchor;
        beforeEach(function () {
            tooltip = document.createElement('zs-tooltip');
            tooltip.style.position = 'fixed';
            tooltip.innerText = 'Hello!';

            anchor = document.createElement('div');
            anchor.innerText = 'Lorem ipsum dolor sit amet';
            anchor.style.position = 'absolute';
            anchor.style.top = '50%';
            anchor.style.left = '50%';
            anchor.setAttribute('id', 'anchor');
            document.body.appendChild(anchor);

            tooltip.setAttribute('for', 'anchor');
        });

        it('should support positioning tooltip on the left side of the anchor', function (done) {
            tooltip.setAttribute('position', 'left');
            document.body.appendChild(tooltip);
            

            setTimeout(function () { // wait for init completed
                tooltip.show();
                var position = tooltip.getBoundingClientRect().left;
                var width = tooltip.getBoundingClientRect().width;
                var anchorPosition = anchor.getBoundingClientRect().left;

                expect(position + width).toBeCloseTo(anchorPosition, 1);
                done();
            }, delay);
        });

        it('should support positioning tooltip on the right side of the anchor', function (done) {
            tooltip.setAttribute('position', 'right');
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                
                var position = tooltip.getBoundingClientRect().left
                var anchorWidth = anchor.getBoundingClientRect().width
                var anchorPosition = anchor.getBoundingClientRect().left

                expect(Math.round(anchorPosition + anchorWidth)).toEqual(Math.round(position));
                done();
            }, delay);
        });

        it('should support positioning tooltip on the top side of the anchor', function (done) {
            tooltip.setAttribute('position', 'top');
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                var position = tooltip.getBoundingClientRect().top;
                var height = tooltip.getBoundingClientRect().height;
                var anchorPosition = anchor.getBoundingClientRect().top
                expect(Math.round((position + height).toFixed(2))).toEqual(Math.round(anchorPosition.toFixed(2)));
                done();
            }, delay);
        });

        it('should support positioning tooltip on the bottom side of the anchor', function (done) {
            tooltip.setAttribute('position', 'bottom');
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                var position = tooltip.getBoundingClientRect().top
                var anchorHeight = anchor.getBoundingClientRect().height;
                var anchorPosition = anchor.getBoundingClientRect().top

                expect(Math.round(anchorPosition + anchorHeight)).toEqual(Math.round(position));
                done();
            }, delay);
        });

        it('should add offset to the left if specified', function (done) {
            tooltip.setAttribute('position', 'left');
            tooltip.setAttribute('offset-x', offset);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                var position = tooltip.getBoundingClientRect().left
                var width = tooltip.getBoundingClientRect().width;
                var anchorPosition = anchor.getBoundingClientRect().left

                expect(position + width + offset).toBeCloseTo(anchorPosition, 1);
                done();
            }, delay);
        });

        it('should add offset to the right if specified', function (done) {
            tooltip.setAttribute('position', 'right');
            tooltip.setAttribute('offset-x', offset);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                var position = tooltip.getBoundingClientRect().left
                var anchorWidth = anchor.getBoundingClientRect().width;
                var anchorPosition = anchor.getBoundingClientRect().left;

                expect(Math.round(anchorPosition + anchorWidth + offset)).toEqual(Math.round(position));
                done();
            }, delay);
        });

        it('should add offset to the top if specified', function (done) {
            tooltip.setAttribute('position', 'top');
            tooltip.setAttribute('offset-y', offset);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                var position = tooltip.getBoundingClientRect().top;
                var height = tooltip.getBoundingClientRect().height;
                var anchorPosition = anchor.getBoundingClientRect().top

                expect(Math.round((position + height + offset).toFixed(2))).toEqual(Math.round((anchorPosition).toFixed(2)));
                done();
            }, delay);
        });

        it('should add offset to the bottom if specified', function (done) {
            tooltip.setAttribute('position', 'bottom');
            tooltip.setAttribute('offset-y', offset);
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.show();
                var position = tooltip.getBoundingClientRect().top;
                var anchorHeight = anchor.getBoundingClientRect().height;
                var anchorPosition = anchor.getBoundingClientRect().top;

                expect(Math.round(anchorPosition + anchorHeight + offset)).toEqual(Math.round(position));
                done();
            }, delay);
        });

        afterEach(function () {
            document.body.removeChild(tooltip);
            tooltip = null;

            document.body.removeChild(anchor);
            anchor = null;
        });

    });

    describe("animation: ", function () {
        var tooltip, anchor;
        beforeEach(function () {
            tooltip = document.createElement('zs-tooltip');
            tooltip.style.opacity = 0;
        });

        it('should support show animation', function (done) {
            tooltip.setAttribute('animate-show-with-duration', 30);
            document.body.appendChild(tooltip);
                
            setTimeout(function () { // wait for init completed
                tooltip.show();
                
                expect(tooltip.isHidden).toBeTruthy();

                setTimeout(function () { // wait for init completed
                    expect(tooltip.isHidden).toBeFalsy();
                    done();
                }, delay);

            }, delay);
        });

        it('should support hide animation', function (done) {
            tooltip.setAttribute('animate-hide-with-duration', 30);
            document.body.appendChild(tooltip);
                
            setTimeout(function () { // wait for init completed
                tooltip.show();
                tooltip.hide();
                
                expect(tooltip.isHidden).toBeFalsy();

                setTimeout(function () { // wait for init completed
                    expect(tooltip.isHidden).toBeTruthy();
                    done();
                }, delay);

            }, delay);
        });

        it('should support show and hide animations at the same time', function (done) {
            tooltip.setAttribute('animate-show-with-duration', 30);
            tooltip.setAttribute('animate-hide-with-duration', 30);
            document.body.appendChild(tooltip);
                
            setTimeout(function () { // wait for init completed
                tooltip.show();
                expect(tooltip.isHidden).toBeTruthy();

                setTimeout(function () { // wait for init completed
                    expect(tooltip.isHidden).toBeFalsy();

                    tooltip.hide();
                    expect(tooltip.isHidden).toBeFalsy();

                    setTimeout(function () { // wait for init completed
                        expect(tooltip.isHidden).toBeTruthy();
                        done();
                    }, delay);

                }, delay);
            }, delay);
        });

        afterEach(function () {
            document.body.removeChild(tooltip);
            tooltip = null;
        });

    });

    describe("content (text/html)", function () {
        var tooltip, parent, content = '<b>Some code</b>';

        it('should support embedding content from tag', function (done) {
            var html = '<zs-tooltip><zs-tooltip-content>' + content + '</zs-tooltip-content></zs-tooltip>';
            parent = document.createElement('div');
            document.body.appendChild(parent);

            parent.innerHTML = html;
            tooltip = parent.querySelector('zs-tooltip');

            setTimeout(function () { // wait for init completed
                expect(tooltip.getContent()).toEqual(content);
                document.body.removeChild(parent);
                parent.removeChild(tooltip);
                parent = null;
                done();
            }, delay);
        });

        it('should support embedding content from code', function (done) {
            tooltip = document.createElement('zs-tooltip');
            document.body.appendChild(tooltip);

            setTimeout(function () { // wait for init completed
                tooltip.setContent(content);
                expect(tooltip.getContent()).toEqual(content);
                document.body.removeChild(tooltip);
                done();
            }, delay);
        });

    });

    describe("additional features: ", function () {
        var tooltip;
        beforeEach(function () {
            tooltip = document.createElement('zs-tooltip');
        });

        it('should support multiple tooltips at one anchor', function (done) {
            document.body.appendChild(tooltip);
            var anchor = document.createElement('div');
            anchor.setAttribute('id', 'anchor');
            anchor.style.position = 'absolute';
            anchor.style.top = '50%';
            anchor.style.left = '50%';
            anchor.innerText = "Hello!";
            document.body.appendChild(anchor)

            var tooltipLeft = document.createElement('zs-tooltip');
            var tooltipRight = document.createElement('zs-tooltip');
            var tooltipTop = document.createElement('zs-tooltip');
            var tooltipBottom = document.createElement('zs-tooltip');

            tooltipLeft.setAttribute('position', 'left');
            tooltipRight.setAttribute('position', 'right');
            tooltipTop.setAttribute('position', 'top');
            tooltipBottom.setAttribute('position', 'bottom');
            
            tooltipLeft.setAttribute('for', 'anchor');
            tooltipRight.setAttribute('for', 'anchor');
            tooltipTop.setAttribute('for', 'anchor');
            tooltipBottom.setAttribute('for', 'anchor');

            tooltipLeft.innerText = "tooltipLeft";
            tooltipRight.innerText = "tooltipRight";
            tooltipTop.innerText = "tooltipTop";
            tooltipBottom.innerText = "tooltipBottom";

            tooltipLeft.style.position = 'fixed';
            tooltipRight.style.position = 'fixed';
            tooltipTop.style.position = 'fixed';
            tooltipBottom.style.position = 'fixed';

            document.body.appendChild(tooltipLeft);
            document.body.appendChild(tooltipRight);
            document.body.appendChild(tooltipTop);
            document.body.appendChild(tooltipBottom);

            setTimeout(function () { // wait for init completed
                tooltipLeft.show();
                tooltipRight.show();
                tooltipTop.show();
                tooltipBottom.show();

                var anchorRect = anchor.getBoundingClientRect();

                var tooltipLeftPosition = tooltipLeft.getBoundingClientRect();
                var tooltipRightPosition = tooltipRight.getBoundingClientRect();
                var tooltipTopPosition = tooltipTop.getBoundingClientRect();
                var tooltipBottomPosition = tooltipBottom.getBoundingClientRect();

                var tooltipPositionRight = Math.round((tooltipLeftPosition.right).toFixed(2));
                var anchorPositionLeft = Math.round((anchorRect.left).toFixed(2));

                var tooltipPositionLeft = Math.round((tooltipRightPosition.left).toFixed(2));
                var anchorPositionRight = Math.round((anchorRect.right).toFixed(2));
                
                var tooltipPositionBottom = Math.round((tooltipTopPosition.bottom).toFixed(2));
                var anchorPositionTop = Math.round((anchorRect.top).toFixed(2));

                var tooltipPositionTop = Math.round((tooltipBottomPosition.top).toFixed(2));
                var anchorPositionBottom = Math.round((anchorRect.bottom).toFixed(2));

                // Sometimes there could be a difference of 1 or 2px.
                expect(Math.abs(tooltipPositionRight - anchorPositionLeft)).toBeLessThan(2);
                expect(Math.abs(tooltipPositionLeft - anchorPositionRight)).toBeLessThan(2);
                expect(Math.abs(tooltipPositionBottom - anchorPositionTop)).toBeLessThan(2);
                expect(Math.abs(tooltipPositionTop - anchorPositionBottom)).toBeLessThan(2);

                document.body.removeChild(tooltipLeft);
                document.body.removeChild(tooltipRight);
                document.body.removeChild(tooltipTop);
                document.body.removeChild(tooltipBottom);
                document.body.removeChild(anchor);

                tooltipLeft = null;
                tooltipRight = null;
                tooltipTop = null;
                tooltipBottom = null;
                anchor = null;

                done();
            }, delay);
        });

        it("should react on window resize", function(done){     
            spyOn(tooltip, '_onResize');
            document.body.appendChild(tooltip);   
            
            setTimeout(function(){
                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                    var evt = document.createEvent('UIEvents');
                    evt.initUIEvent('resize', true, false, window, 0);
                    window.dispatchEvent(evt);
                } else {
                    window.dispatchEvent(new Event('resize'));
                }

                expect(tooltip._onResize).toHaveBeenCalled();
                done();
            }, 100)
        });

        it("should NOT react on window resize after cleanup", function(done){     
            spyOn(tooltip, '_onResize');
            
            document.body.appendChild(tooltip);   
            
            setTimeout(function(){
                tooltip.cleanUp();
                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                    var evt = document.createEvent('UIEvents');
                    evt.initUIEvent('resize', true, false, window, 0);
                    window.dispatchEvent(evt);
                } else {
                    window.dispatchEvent(new Event('resize'));
                }

                expect(tooltip._onResize).not.toHaveBeenCalled();
                done();
            }, 100)
        });

        it("should react on window scroll", function(done){     
            spyOn(tooltip, '_onScroll');
            document.body.appendChild(tooltip);   
            
            setTimeout(function(){
                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                    var evt = document.createEvent('UIEvents');
                    evt.initUIEvent('scroll', true, false, window, 0);
                    window.dispatchEvent(evt);
                } else {
                    window.dispatchEvent(new Event('scroll'));
                }

                expect(tooltip._onScroll).toHaveBeenCalled();
                done();
            }, 100)
        });

        it("should NOT react on window scroll after cleanup", function(done){     
            spyOn(tooltip, '_onScroll');
            
            document.body.appendChild(tooltip);   
            
            setTimeout(function(){
                tooltip.cleanUp();
                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                    var evt = document.createEvent('UIEvents');
                    evt.initUIEvent('scroll', true, false, window, 0);
                    window.dispatchEvent(evt);
                } else {
                    window.dispatchEvent(new Event('scroll'));
                }

                expect(tooltip._onScroll).not.toHaveBeenCalled();
                done();
            }, 100)
        });

        afterEach(function () {
            document.body.removeChild(tooltip);
            tooltip = null;
        });

    });
});