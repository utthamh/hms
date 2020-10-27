(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.eventsM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.handleEvent = handleEvent;
  _exports.on = on;
  _exports.off = off;
  _exports.fire = fire;
  _exports.preventEvent = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * @module Smart events
   * @author: Mikhail Vazhenin @ZS, Andrea Giammarchi @WebReflection
   * @copyright: Copyright (c) 2018 ZS Associates; 2018 Andrea Giammarchi, @WebReflection under ISC
   */

  /**
   * Block an event. Use it as an event handler for addEventListener method or inside "events" object.
   * @param {object} e Event to block.
   */
  var preventEvent = function preventEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  };
  /**
   * Handle an event for an object via handleEvent DOM API {@link https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent}. 
   * Borrowed this idea from Andrea Giammarchi {@link https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38)}
   * @param {Event} event - event to handle
   */


  _exports.preventEvent = preventEvent;

  function handleEvent(event) {
    var handler = this,
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

    if (!Array.isArray(events) && typeof events != 'string') {
      throw 'Invalid events type ' + _typeof(events);
    }

    if (typeof events == 'string') {
      events = [events];
    }

    if (typeof fromObject.addEventListener != 'function') {
      throw 'Can\'t subscribe';
    }

    if (unsubscribe && typeof fromObject.removeEventListener != 'function') {
      throw 'Can\'t unsubscribe';
    }

    events.forEach(function (event) {
      var listener = toObject;

      if (_typeof(listener) == 'object' && !toObject.handleEvent) {
        listener = toObject['on' + event];
      }

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

    if (typeof target.dispatchEvent != 'function') {
      throw 'Can`t dispatch events';
    }

    target.dispatchEvent(event);
    return event;
  }
});
//# sourceMappingURL=events.js.map
