/**
 * @module Smart events
 * @author: Mikhail Vazhenin @ZS, Andrea Giammarchi @WebReflection
 * @copyright: Copyright (c) 2018 ZS Associates; 2018 Andrea Giammarchi, @WebReflection under ISC
 */


/**
 * Block an event. Use it as an event handler for addEventListener method or inside "events" object.
 * @param {object} e Event to block.
 */
var preventEvent = function (e) {
	e.stopPropagation();
	e.preventDefault();
}


 /**
  * Handle an event for an object via handleEvent DOM API {@link https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent}. 
  * Borrowed this idea from Andrea Giammarchi {@link https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38)}
  * @param {Event} event - event to handle
  */
 function handleEvent(event) {
	var handler =  this,
		type = 'on' + event.type;
	
	if (typeof handler[type] == 'function') // guard
		handler[type](event);
}

/**
 * Subscribe to events from another HTMLElement using handleEvent API.
 * @see handleEvent
 * @param {array|string} Events - Event name or an array of event names.
 * @param {?HTMLElement|object} toObject - Event handler with `handleEvent` method.
 * @param {?HTMLElement|object} fromObject - Event emitter.
 * @param {?boolean} unsubscribe - Optional flag to unsubscribe
 * @param {?boolean} passive - Optional flag to create a passive event listeners
 */
function on(events, toObject, fromObject, unsubscribe, passive) {
	toObject = toObject || this;
	fromObject = fromObject || this;
	if (!Array.isArray(events) && typeof events != 'string') {throw 'Invalid events type ' + typeof events;}
	if (typeof events == 'string') {events = [events];}
	if (typeof fromObject.addEventListener != 'function') {throw 'Can\'t subscribe';}
	if (unsubscribe && typeof fromObject.removeEventListener != 'function') {throw 'Can\'t unsubscribe';}
	events.forEach((event) => {
		var listener = toObject;
		if (typeof listener == 'object' && !toObject.handleEvent) {listener = toObject['on'+event];}

		if (unsubscribe) {
			fromObject.removeEventListener(event, listener);
			return;
		}
		fromObject.addEventListener(event, listener, !!passive);
	});
}

/**
 * Unsubscribe from events emitted by another HTMLElement via handleEvent API.
 * @see handleEvent
 * @see on
 */
function off(events, toObject, fromObject) {
	on.call(this, events, toObject, fromObject, true);
}

/**
 * Shortcut to dispatch a custom or native event 
 * @param {string|object} event - Event name or an event instance
 * @param {?object} params - Optional parameters {bubbles: true, detail: {...}} 
 * @param {?HTMLElement} target - Optional target of the event
 * @return {?CustomEvent} - New custom event
 */
function fire(event, params, target) {
	if (typeof event == 'string') {
		event = new CustomEvent(event, params);
	} 

	target = target || this;
	if (typeof target.dispatchEvent != 'function') {throw 'Can`t dispatch events';}
	target.dispatchEvent(event);
	return event;
}

export {handleEvent, on, off, fire, preventEvent}