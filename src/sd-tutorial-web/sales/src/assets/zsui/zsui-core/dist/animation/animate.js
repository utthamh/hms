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
    global.animateM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
   * Animation behavior for ZSUI library
   * @module animate
   */

  /**
   * Prototype of a transition. Based on CSS transitions
   * @property {object} before - Initial state of transition with CSS styles to be applied to an HTML element before transition starts
   * @property {object} after - CSS styles with final state of transition
   * @property {object} reset - CSS styles to be applied between transitions to reset them
   * @memberof zs
   */
  var transition = {
    before: null,
    after: null,
    reset: null
  };
  /**
   * Prototype of an animation.
   * @property {string} effect - Name of a transition						
   * @property {number} duration - Duration of the transition in milliseconds
   * @property {transition} options - Transition properties @see zs.transition
   * @property {HTMLElement} el - Target of transition
   * @property {boolean} isRunning - Indicates if transition is in progress or not 
   * @property {promise} promise - Holds a promise to wait for while transition is in progress
   * @property {object} currentEffect - Stores an object with properties of current transition @see zs.transition
   * @property {object} definedTransitions - A collection of transition that could be defined and a reused
   */

  var animation = {
    effect: "",
    duration: 0,
    options: null,
    el: null,
    isRunning: false,
    promise: null,
    currentEffect: null,
    definedTransitions: {},

    /**
     * Create and register a new transition
     * @param {string} name - Name of the transition
     * @param {object} params - Properties of the transition object to create 
     * @see zs.transition
     */
    registerTransition: function registerTransition(name, params) {
      var transition = Object.create(zs.transition);
      Object.assign(transition, params);
      this.definedTransitions[name] = transition;
      return transition;
    },

    /**
     * Transition from initial to final state of an element
     * @param {transition=} params - Additional parameters of the transitions
     * @see zs.transition
     */
    transition: function transition(params) {
      if (!this.el) {
        return;
      }

      var effect = this.definedTransitions[this.effect] || {};
      var before = effect.before || {};
      var options = Object.assign(this.options || {}, params);
      var after = effect.after || effect;
      var reset = effect.reset; // Set initial state with custom options

      Object.assign(this.el.style, before, options.before); // Set duration

      this.el.style.transitionDuration = parseFloat(this.duration / 1000).toFixed(2) + 's'; // Go to the final state and apply custom options

      Object.assign(this.el.style, after, options.after || options);
      this.currentEffect = effect;
    },

    /**
     * Start an animation
     * @param {transition=} params - Additional parameters of the transition
     * @param {number=} duration - Modified duration of the transition
     */
    start: function start(params, duration) {
      var animation = this;
      animation.isRunning = true;

      if (duration) {
        this.duration = duration;
      }

      this.transition(params);
      var prom = new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (animation.el) {
            Object.assign(animation.el.style, {
              transition: 'none'
            }, animation.currentEffect.reset);
          }

          resolve(animation);
        }, duration || animation.duration);
      });
      animation.promise = prom;
      animation.promise.then(function () {
        animation.isRunning = false;
      });
      return prom;
    },

    /**
     * Stop a running animation
     */
    stop: function stop() {
      var animation = this;

      if (this.isRunning) {
        this.promise.resolve(animation);
      }
    }
  };
  /**
   * Simple animation behavior based on CSS transitions 
   */

  var animate = {
    /**
     * Hash-table with animations
     */
    animations: null,

    /**
     * Register an animation that can be reused multiple times
     * @param {string} effectName - Name of the effect to use like "slide", "rotate", etc...
     * @param {number} duration - Duration of the animation in milliseconds
     * @param {object} options - Additional parameters of the animation
     * @return {animation} - An instance of animation
     * @see zs.animation
     */
    registerAnimation: function registerAnimation(effectName, duration, options) {
      if (!this.animations) {
        this.animations = {};
      }

      var animation = Object.assign(Object.create(zs.animation), {
        effect: effectName,
        duration: duration,
        options: options,
        el: this
      });
      this.animations[effectName] = animation;
      return animation;
    },

    /**
     * Start an animation
     * @param {string} effectName - Name of the previously created animation or a new one
     * @param {number=} duration - Modified duration of the animation in milliseconds
     * @param {object=} options - Modified parameters of the animation 
     * @return {promise} - Promise of animation 
     */
    startAnimation: function startAnimation(effectName, duration, options) {
      if (!this.animations) {
        this.animations = {};
      }

      var animation = this.animations[effectName] || this.registerAnimation(effectName, duration, options);
      return animation.start(options, duration);
    }
  }; // Add animation behaviors to zs namespace for backward compatibility.

  window.zs = window.zs || {};
  window.zs.transition = transition;
  window.zs.animation = animation;
  window.zs.animate = animate;
  var _default = {
    transition: transition,
    animation: animation,
    animate: animate
  };
  _exports.default = _default;
});
//# sourceMappingURL=animate.js.map
