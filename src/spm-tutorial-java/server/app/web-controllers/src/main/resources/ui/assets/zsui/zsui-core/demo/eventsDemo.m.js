import {on, eventHandler, fire, off} from '../src/smart/events.m.js';
import {mix} from '../src/smart/mixin.m.js';

class MyButton extends HTMLButtonElement {
	onclick() {
		this.innerText = 'Clicked';
		this.classList.toggle('zs-button-action');
	}
	connectedCallback() {		
		this.on('click', this);
	}
}

mix(MyButton.prototype, {eventHandler, on, off, fire});
customElements.define('my-button', MyButton, {extends: 'button'});