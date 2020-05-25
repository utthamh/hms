import syncProps from '../src/smart/syncProps.m.js';
import {mix} from '../src/smart/mixin.m.js';

class MyButton extends HTMLButtonElement {
	constructor() {
		super();
	}
	static get observedAttributes() {
		return ['value', 'disabled'];
	}
	render() {
		this.innerHTML = (this.value || 0) + "/" + (this.getAttribute('value') || 0);
	}
	propertyChangedCallback(name, oldValue, newValue) {
		console.log('prop changed', name, oldValue, newValue);
		this.render();
	}
	attributeChangedCallback(name, oldValue, newValue) {
		console.log('attr changed', name, oldValue, newValue);
		if (name == 'value') {
			this.syncAttr(name, newValue, 'number');
		}
		if (name == 'disabled') {
			this.syncAttr(name, newValue, 'boolean');
		}
	}
	connectedCallback() {
		this.render();
		
		// Randomly change the value on click
		this.addEventListener('click', function() {
			this.value = ~~(Math.random()*100);			
		}, true);

		this.syncProp('value');
		this.syncProp('disabled');
	}
}

mix(MyButton.prototype, syncProps);
customElements.define('my-button', MyButton, {extends: 'button'});