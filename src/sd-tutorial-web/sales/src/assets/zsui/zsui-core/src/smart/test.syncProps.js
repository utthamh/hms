describe('Sync attributes and properties', function () {
	var syncProps = syncPropsM.default;
	// Define a smart component
	var testElement = zs.customElement(HTMLElement, 'zs-sync-prop-element', null, [syncProps, {
		// Should observe attributes
		observedAttributes: ['test-bool', 'test-num', 'test-str', 'test-blank'],
		propertyChangedCallback: function(name, oldValue, newValue) {
			console.log('property changed', name, oldValue, newValue);
		},
		attributeChangedCallback: function(name, oldValue, newValue) {			
			console.log('attribute changed', name, newValue);
			if (name == 'test-blank') {return;}
			if (name == 'test-bool') {
				propertyType = 'boolean';
			} else if (name == 'test-num') {
				propertyType = 'number';
			} else {
				propertyType = 'string';
			}
			this.syncAttr(name, newValue, propertyType);
		},
		init: function () {
			if (!this._isCreated) {
				this.syncProp('testStr');
				this.syncProp('testBool');
				this.syncProp('testNum');		
				this._isCreated = true;
			}
		}
	}]);

	it('can convert prop names to attribute names and wise-versa', function () {
		expect(syncProps.attrToPropName('test-attr-name')).toBe('testAttrName');
		expect(syncProps.propToAttrName('testAttrName')).toBe('test-attr-name');
	});

	it('can properly set values for attribute and/or property', function () {

		// Attribute
		expect(syncProps.propToAttrValue('string')).toBe('string');
		expect(syncProps.propToAttrValue(null)).toBe('');
		expect(syncProps.propToAttrValue(undefined)).toBe('');
		expect(syncProps.propToAttrValue(true)).toBe('true');
		expect(syncProps.propToAttrValue(false)).toBe('false');
		expect(syncProps.propToAttrValue(0)).toBe('0');
		expect(syncProps.propToAttrValue(NaN)).toBe('NaN');

		// Property
		expect(syncProps.attrToPropValue('test', 'string', 'string')).toBe('string');
		expect(syncProps.attrToPropValue('test', 'true', 'boolean')).toBe(true);
		expect(syncProps.attrToPropValue('test', '', 'boolean')).toBe(true);
		expect(syncProps.attrToPropValue('test', 'false', 'boolean')).toBe(false);
		expect(syncProps.attrToPropValue('test', '2', 'number')).toBe(2);
		expect(syncProps.attrToPropValue('test', 'NaN', 'number')).toBeNaN();
		expect(syncProps.attrToPropValue('test', '0', 'number')).toBe(0);
	});


	it('can sync observed attributes', function (done) {
		utils.isBehavior(expect, syncProps);
		el = new testElement();
		


		utils.isPropAttrSync(expect, null, el, 'testStr', 'string');
		utils.isPropAttrSync(expect, null, el, 'testNum', 'number');
		utils.isPropAttrSync(expect, null, el, 'testBool', 'boolean');
		
		// Check for the case when we don't sync one of attributes with a property
		el1 = new testElement();
		el1.setAttribute('test-blank','test');
		setTimeout(function() {
			expect(el.testBlank == null).toBeTruthy();
			done();
		},100);
	});
});