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
    global.tooltipM = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
   * Tooltips are UIs dedicated to showing hint or additional information of element
   * 
   * @namespace     
   */
  var tooltip = {
    /**
     * @private
     * @type {Number}
     */
    _animateShowWithDuration: null,

    /**
     * @private
     * @type {Number}
     */
    _animateHideWithDuration: null,

    /**
     * @private
     * @type {String}
     */
    _arrowPosition: null,

    /**
     * @private
     * @type {String}
     */
    _for: null,

    /**
     * @private
     * @type {Number}
     */
    _mode: null,

    /**
     * @private
     * @type {Boolean}
     */
    _norender: null,

    /**
     * @private
     * @type {Number}
     */
    _offsetX: null,

    /**
     * @private
     * @type {Number}
     */
    _offsetY: null,

    /**
     * @private
     * @type {String}
     */
    _position: null,

    /**
     * @private
     * @type {HTMLElement}
     */
    _anchor: null,

    /**
     * @private
     * @type {Boolean}
     */
    _isHidden: null,

    /**
     * @private
     * @type {Boolean}
     */
    _isStartedHidding: null,

    /**
     * @private
     * @type {Boolean}
     */
    _isStartedShowing: null,

    /**
     * Default params
     * 
     * @private
     * @type {Object}
     */
    _defaults: {
      'animate-show-with-duration': 0,
      'animate-hide-with-duration': 0,
      'arrow-position': 'auto',
      for: '',
      mode: 'auto',
      norender: false,
      'offset-x': 0,
      'offset-y': 0,
      position: 'bottom'
    },

    /**
     * If we already rendered this element?
     * 
     * @private
     * @property {Boolean}
     */
    _isRendered: null,

    /**
     * If we already rendered this element?
     * 
     * @private
     * @property {Boolean}
     */
    _availableArrowPositions: ['auto', 'none', 'left', 'right', 'top', 'bottom'],

    /**
     * If we already rendered this element?
     * 
     * @private
     * @property {Boolean}
     */
    _availablePositions: ['auto', 'left', 'right', 'top', 'bottom'],

    /**
     * If we already rendered this element?
     * 
     * @private
     * @property {Boolean}
     */
    _availableModes: ['auto', 'manual'],

    /**
     * List of attributes to be listened for change event
     * 
     * @private
     * @property {String[]}
     */
    observedAttributes: ['animate-show-with-duration', 'animate-hide-with-duration', 'arrow-position', 'for', 'mode', 'norender', 'offset-x', 'offset-y', 'position'],

    /**
     * Ref to arrow
     * 
     * @private
     * @property {HTMLElement}
     */
    _arrow: null,

    /**
     * Ref onResize callback
     * 
     * @private
     * @property {Object}
     */
    _onResize: null,

    /**
     * Ref onScroll callback
     * 
     * @private
     * @property {Object}
     */
    _onScroll: null,

    /**
     * Calculated properties
     * 
     * @private
     * @property {Object}
     */
    properties: {
      /**
       * Descibes should tooltip be shown with animation and if so how long this animation should take. 
       * Default is 0, no animation (shown immidiately)
       * 
       * @memberof zs.tooltip
       * @property {Number}
       */
      'animate-show-with-duration': {
        set: function set(value) {
          if (isNaN(value) || value < 0) {
            value = this._defaults['animate-show-with-duration'];
          }

          this._checkAndUpdateAttrByProp('animate-show-with-duration', value);

          this._animateShowWithDuration = +value;
        },
        get: function get(value) {
          return this._animateShowWithDuration;
        }
      },

      /**
       * Descibes should tooltip be hidden with animation and if so how long this animation should take. 
       * Default is 0, no animation (hidden immidiately)
       * 
       * @memberof zs.tooltip
       * @property {Number}
       */
      'animate-hide-with-duration': {
        set: function set(value) {
          if (isNaN(value) || value < 0) {
            value = this._defaults['animate-hide-with-duration'];
          }

          this._checkAndUpdateAttrByProp('animate-hide-with-duration', value);

          this._animateHideWithDuration = +value;
        },
        get: function get(value) {
          return this._animateHideWithDuration;
        }
      },

      /**
       * Defines position of arrow. 
       * 
       * 'auto' - zs.tooltip will try to find the best position for arrow
       * 'bottom' - arrow will be placed on the bottom of the tooltip
       * 'top' - arrow will be placed on the top of the tooltip
       * 'left' - arrow will be placed on the left side of the tooltip
       * 'right' - arrow will be placed on the left side of the tooltip
       * 
       * Default is 'auto'
       * 
       * @memberof zs.tooltip
       * @property {String}
       */
      'arrow-position': {
        set: function set(value) {
          if (this._availableArrowPositions.indexOf(value) < 0) {
            value = this._defaults['arrow-position'];
          }

          this._checkAndUpdateAttrByProp('arrow-position', value);

          this._arrowPosition = value;
        },
        get: function get(value) {
          return this._arrowPosition;
        }
      },

      /**
       * Defines id of element to which tooltip is anchored. 
       * If this is not specified or element wans't found by selector, parent element is considered as anchor
       * 
       * Default is ''
       * 
       * @memberof zs.tooltip
       * @property {String} [for='']
       */
      for: {
        set: function set(value) {
          if (!value || !document.getElementById(value)) {
            value = this._defaults.for;
          }

          this._checkAndUpdateAttrByProp('for', value);

          this._for = value;
        },
        get: function get(value) {
          return this._for;
        }
      },

      /**
       * Defines mode of tooltip. In 'manual' mode tooltip won't be shown/hidden automatically.
       * 
       * Default is 'auto'
       * 
       * @memberof zs.tooltip
       * @property {Number} [mode='auto']
       */
      mode: {
        set: function set(value) {
          if (this._availableModes.indexOf(value) < 0) {
            value = this._defaults.mode;
          }

          this._checkAndUpdateAttrByProp('mode', value);

          this._mode = value;
        },
        get: function get(value) {
          return this._mode;
        }
      },

      /**
       * Defines of tooltip should be (false) or not (true) rendered on attach
       * 
       * Default is false (will be rendered on attach)
       * @example <zs-tooltip id="misc-norender-tooltip" offset-y="10" norender="true">Lorem ipsum dolor</zs-tooltip>
       * @memberof zs.tooltip
       * @property {Boolean} [norender=false]
       */
      norender: {
        set: function set(value) {
          this._checkAndUpdateAttrByProp('norender', value);

          if (typeof value == 'string') {
            if (value == 'false') {
              value = false;
            } else {
              value = true;
            }
          }

          this._norender = value;
        },
        get: function get(value) {
          return this._norender;
        }
      },

      /**
       * Offset from anchored element in X dimension
       * 
       * Default is 0
       * 
       * @memberof zs.tooltip
       * @property {Number} [offset-x=0]
       */
      'offset-x': {
        set: function set(value) {
          if (isNaN(value) || value < 0) {
            value = this._defaults['offset-x'];
          }

          this._checkAndUpdateAttrByProp('offset-x', value);

          this._offsetX = value;
        },
        get: function get(value) {
          return this._offsetX;
        }
      },

      /**
       * Offset from anchored element in Y dimension
       * 
       * Default is 0
       * 
       * @memberof zs.tooltip
       * @property {Number} [offset-y=0]
       */
      'offset-y': {
        set: function set(value) {
          if (isNaN(value) || value < 0) {
            value = this._defaults['offset-y'];
          }

          this._checkAndUpdateAttrByProp('offset-y', value);

          this._offsetY = value;
        },
        get: function get(value) {
          return this._offsetY;
        }
      },

      /**
       * Defines position of tooltip relatively to anchor. 
       * 
       * 'auto' - zs.tooltip will try to find the best position for tooltip
       * 'bottom' - tooltip will be placed on the bottom of the anchor
       * 'top' - tooltip will be placed on the top of the anchor
       * 'left' - tooltip will be placed on the left side of the anchor
       * 'right' - tooltip will be placed on the left side of the anchor
       * 
       * Default is 'bottom'
       * 
       * @memberof zs.tooltip
       * @property {String} [position='bottom']
       */
      position: {
        set: function set(value) {
          if (this._availablePositions.indexOf(value) < 0) {
            value = this._defaults.position;
          }

          this._checkAndUpdateAttrByProp('position', value);

          this._position = value;
        },
        get: function get(value) {
          return this._position;
        }
      },

      /**
       * Reference to anchor HTMLElement. Readonly
       * 
       * Default is null
       * 
       * @memberof zs.tooltip
       * @readonly
       * @property {HTMLElement} [anchor=null]
       */
      anchor: {
        get: function get(value) {
          return this._anchor;
        }
      },

      /**
       * Is element hidden now?
       * 
       * 
       * @memberof zs.tooltip
       * @readonly
       * @property {Boolean} [isHidden = null]
       */
      isHidden: {
        get: function get(value) {
          return this._isHidden;
        }
      }
    },

    /** */
    events: {
      create: function create() {
        this._isRendered = false; // store them to be able to remove listeners in future

        this._onScroll = this._anchorDeactivated.bind(this);
        this._onResize = this._prepare.bind(this);
      },
      attach: function attach() {
        var self = this;
        setTimeout(function () {
          // wait
          self._setDefaults();

          self.render();
        }, 0);
      },
      attributeChange: function attributeChange(event) {
        this._checkAndUpdatePropByAttr(event.detail.attributeName, event.detail.newValue);
      },
      detach: function detach() {
        this.cleanUp();
      }
    },

    /**
     * Set default values to properties
     * 
     * @private
     * 
     * @returns {zs.tooltip}
     */
    _setDefaults: function _setDefaults() {
      for (var i in this.properties) {
        var value = this._defaults[i];

        if (!this.properties.hasOwnProperty(i)) {
          // that's even not ours property
          continue;
        }

        if (this[i] !== null) {
          // value was already set
          continue;
        }

        if (this[i] == value) {
          // this particular value was already set
          continue;
        }

        this[i] = value;
      }

      return this;
    },

    /**
     * Check if it is necessary to update attribute after 
     * property was changes and if so updates it
     * 
     * @private
     * 
     * @param {String} name - Name of attribute
     * @param {String} value - Value to be set
     * 
     * @returns {zs.tooltip}
     */
    _checkAndUpdateAttrByProp: function _checkAndUpdateAttrByProp(name, value) {
      if (value == this.getAttribute(name)) {
        return this;
      }

      this.setAttribute(name, value);

      if (this._isRendered && name !== 'norender') {
        this.render();
      }

      return this;
    },

    /**
     * Check if it is necessary to update property after 
     * attribute was changes and if so updates it
     * 
     * @private
     * 
     * @param {String} name - Name of property
     * @param {String} value - Value to be set
     * 
     * @returns {zs.tooltip}
     */
    _checkAndUpdatePropByAttr: function _checkAndUpdatePropByAttr(name, value) {
      if (!this.properties.hasOwnProperty(name)) {
        return this;
      }

      var currentVallue = '' + this[name];

      if (currentVallue == value) {
        return this;
      }

      this[name] = value;

      if (this._isRendered && name !== 'norender') {
        this.render();
      }

      return this;
    },

    /**
     * Clean up element, usually before render
     * 
     * @chainable
     * 
     * @returns {zs.tooltip}
     */
    cleanUp: function cleanUp() {
      zs.domHelper.empty(this);

      if (this._arrow) {
        if (this._arrow.parentNode) {
          this._arrow.parentNode.removeChild(this._arrow);
        }

        this._arrow = null;
      }

      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onResize);
      return this;
    },

    /**
     * Show tooltip
     * 
     * @chainable
     * 
     * @returns {zs.tooltip}
     */
    show: function show() {
      this.dispatchEvent(new CustomEvent('beforeshow'));
      this._isStartedShowing = true;
      this._isStartedHidding = false;
      this.style.visibility = 'visible';
      var self = this;
      self.style.transition = 'none';

      if (self['animate-show-with-duration'] > 0) {
        self.style.transition = 'opacity ' + (this['animate-show-with-duration'] / 1000).toFixed(2) + 's';
        self.style.opacity = 1;
      } else {
        self._finalizeAfterShowHide();
      }

      this._positioning();

      return this;
    },

    /**
     * Hide tooltip
     * 
     * @chainable
     * 
     * @returns {zs.tooltip}
     */
    hide: function hide() {
      this.dispatchEvent(new CustomEvent('beforehide'));
      this._isStartedShowing = false;
      this._isStartedHidding = true;
      this.style.transition = 'none';

      if (this['animate-hide-with-duration'] > 0) {
        this.style.transition = 'opacity ' + (this['animate-hide-with-duration'] / 1000).toFixed(2) + 's';
        this.style.opacity = 0;
      } else {
        this._finalizeAfterShowHide();
      }

      return this;
    },

    /**
     * Sets content of tooltip
     * 
     * @chainable
     * 
     * @param {String} content
     * 
     * @returns {zs.tooltip}
     */
    setContent: function setContent(content) {
      var contentElm = this.querySelector('zs-tooltip-content');

      if (!contentElm) {
        contentElm = document.createElement('zs-tooltip-content');
        this.appendChild(contentElm);
      }

      contentElm.innerHTML = content;
    },

    /**
     * Returns current content
     * 
     * @chainable
     * 
     * @returns {String}
     */
    getContent: function getContent() {
      var contentElm = this.querySelector('zs-tooltip-content');

      if (!contentElm) {
        contentElm = document.createElement('zs-tooltip-content');
        this.appendChild(contentElm);
      }

      return contentElm.innerHTML;
    },

    /**
     * Destroy tooltip
     * 
     * @chainable
     * 
     * @returns {zs.tooltip}
     */
    destroy: function destroy() {
      this.dispatchEvent(new CustomEvent('beforedestroy'));
      this.cleanUp();
      this.parentNode.removeChild(this);
      this.dispatchEvent(new CustomEvent('destroy'));
      return this;
    },

    /**
     * Fires when anchor was activated in some way (clicked, hovered etc)
     * 
     * If zsTooltip is in "auto" mode it shows tooltip
     * 
     * @chainable
     * @private
     * 
     * @param {Event} e
     * 
     * @returns {zs.tooltip}
     */
    _anchorActivated: function _anchorActivated(e) {
      if (this.mode != 'auto') {
        return this;
      }

      this.show();
      return this;
    },

    /**
     * Fires when anchor was deactivated in some way (mouseleaved etc)
     * 
     * If zsTooltip is in "auto" mode it hides tooltip
     * 
     * @chainable
     * @private
     * 
     * @param {Event} e
     * 
     * @returns {zs.tooltip}
     */
    _anchorDeactivated: function _anchorDeactivated(e) {
      if (this.mode != 'auto') {
        return this;
      }

      if (this.isHidden) {
        return this;
      }

      this.hide();
      return this;
    },

    /**
     * Define element that is anchor
     * 
     * @chainable
     * 
     * @returns {zs.tooltip}
     * @private
     */
    _defineAnchor: function _defineAnchor() {
      if (this.anchor) {
        // if anchor was already defined skip it
        return this;
      }

      if (!this.for) {
        // if user does not specified 'for' selector use paren node for anchor
        this._anchor = this.parentNode || document.body;
        return this;
      } // otherwise try to analize 'for'


      var anchor = document.getElementById(this.for);

      if (!(anchor instanceof HTMLElement)) {
        console.warn('zsTooltip: Cannot find element by selector specified in "for". Fallback to parent node instead');
        this._anchor = this.parentNode || document.body;
        return this;
      } // if selector was correct - use this element


      this._anchor = anchor;
      return this;
    },

    /**
     * Add Listeners to all supported events for anchor
     * 
     * @chainable
     * 
     * @returns {zs.tooltip}
     * @private
     */
    _addListeners: function _addListeners() {
      var self = this;
      self.clicked = false;
      this.anchor.addEventListener('click', function (e) {
        if (!self.isHidden) {
          return;
        }

        self._anchorActivated(e);
      });
      this.anchor.addEventListener('mouseenter', function (e) {
        self._anchorActivated(e);
      });
      this.anchor.addEventListener('mouseleave', function (e) {
        self._anchorDeactivated(e);
      });
      document.addEventListener('touchend', function (e) {
        if (self.isHidden) {
          return;
        }

        if (self._isStartedShowing) {
          return;
        }

        if (self._isStartedHidding) {
          return;
        }

        self._anchorDeactivated(e);
      });
      return this;
    },

    /**
     * @private
     */
    _prepareArrow: function _prepareArrow() {
      var position = this['arrow-position'];

      if (position === 'none') {
        return this;
      }

      var arrow = document.createElement('zs-tooltip-arrow');
      this.appendChild(arrow);

      switch (position) {
        case 'left':
          arrow.classList.add('left');
          break;

        case 'top':
          arrow.classList.add('top');
          break;

        case 'right':
          arrow.classList.add('right');
          break;

        case 'bottom':
          arrow.classList.add('bottom');
          break;

        default:
          ;
      }

      this._arrow = arrow;
      return this;
    },

    /**
     * @private
     */
    _positioning: function _positioning() {
      //Return if anchor element is currently hidden (incase of tabs and modals)
      if (this.anchor.offsetHeight <= 0 && this.anchor.offsetWidth <= 0) {
        return;
      }

      var rect = this.getBoundingClientRect();
      var anchorRect = this.anchor.getBoundingClientRect();
      this.style.width = rect.width + 'px';
      var top = rect.top;
      var bottom = rect.bottom;
      var left = rect.left;
      var right = rect.right;
      var anchorTop = anchorRect.top;
      var anchorBottom = anchorRect.bottom;
      var anchorLeft = anchorRect.left;
      var anchorRight = anchorRect.right;
      var offsetY = +this['offset-y'];
      var offsetX = +this['offset-x']; // Normilize

      this.style.top = 'auto';
      this.style.bottom = 'auto';
      this.style.right = 'auto';
      this.style.left = 'auto';
      this.classList.remove('top');
      this.classList.remove('bottom');
      this.classList.remove('right');
      this.classList.remove('left');
      var anchorCenterX = anchorLeft + anchorRect.width / 2;
      var anchorCenterY = anchorTop + anchorRect.height / 2;
      var space = 10;
      var position = this.position;

      switch (position) {
        case 'top':
          this.style.top = anchorTop - rect.height - offsetY + 'px';
          this.style.left = anchorCenterX - rect.width / 2 + 'px';
          this.classList.add('top');
          break;

        case 'bottom':
          this.style.top = anchorBottom + offsetY + 'px';
          this.style.left = anchorCenterX - rect.width / 2 + 'px';
          this.classList.add('bottom');
          break;

        case 'left':
          this.style.left = anchorLeft - rect.width - offsetX + 'px';
          this.style.top = anchorCenterY - rect.height / 2 + 'px';
          this.classList.add('left');
          break;

        case 'right':
          this.style.left = anchorRight + offsetX + 'px';
          this.style.top = anchorCenterY - rect.height / 2 + 'px';
          this.classList.add('right');
          break;
        // default:
        //     if(anchorBottom + offsetY > space) { // try top
        //         this.style.top = (anchorBottom + offsetY) + 'px';
        //         this.classList.add('bottom');
        //     } else {
        //         this.style.top = (anchorTop - rect.height - offsetY) + 'px';
        //         this.classList.add('top');
        //     }
        //     this.style.left = (anchorCenterX - rect.width / 2) + 'px';
        //     if(parseFloat(this.style.left) < space){
        //         this.style.left = (anchorRight + offsetX) + 'px';
        //         this.classList.remove('top');
        //         this.classList.remove('bottom');
        //         this.classList.add('right');
        //         this.style.top = (anchorCenterY - rect.height / 2) + 'px';
        //     } else if(parseFloat(this.style.left) + rect.width > window.innerWidth - space){
        //         this.classList.remove('top');
        //         this.classList.remove('bottom');
        //         this.style.left = (anchorLeft - rect.width - offsetX) + 'px';
        //         this.style.top = (anchorCenterY - rect.height / 2) + 'px';
        //         this.classList.add('left');
        //     }
      }
      /**
       * Browser tries to optimize size of the element
       * In some cases changing of the position of element will affect this optimization
       * Sometimes it causes side affects (like continues "moving" of tooltip with every new showing)
       * To prevent that let set a fixed width
       */


      var updateRect = this.getBoundingClientRect();
      var width = updateRect.width;

      if (position !== 'right' && updateRect.right > window.innerWidth) {
        width = updateRect.width - (updateRect.right - window.innerWidth) * 2 - 10;
        this.style.width = width + 'px';

        this._positioning();
      } else if (position !== 'left' && updateRect.left < 0) {
        width = updateRect.width + updateRect.left * 2 - 10;
        this.style.width = width + 'px';

        this._positioning();
      }
    },

    /**
     * @private
     */
    _whenAnimationFinished: function _whenAnimationFinished(e) {
      if (e.propertyName !== 'opacity') {
        return this;
      }

      return this._finalizeAfterShowHide();
    },

    /**
     * @private
     */
    _finalizeAfterShowHide: function _finalizeAfterShowHide() {
      if (this._isStartedHidding) {
        this._isHidden = true;
        this._isStartedHidding = false;
        this.style.visibility = 'hidden';
        this.style.opacity = 0;
        this.dispatchEvent(new CustomEvent('hide'));
      } else {
        this._isHidden = false;
        this._isStartedShowing = false;
        this.style.visibility = 'visible';
        this.style.opacity = 1;
        this.dispatchEvent(new CustomEvent('show'));
      }

      return this;
    },

    /**
     * @private
     */
    _prepare: function _prepare() {
      this.style.width = 'auto';

      this._positioning();
    },

    /**
     * Render this element
     * 
     * @chainable
     * 
     * @returns {zs.tooltip}
     */
    render: function render() {
      if (this.norender) {
        return;
      }

      this.dispatchEvent(new CustomEvent('beforerender'));
      var oldContentElm = this.querySelector('zs-tooltip-content');
      var content = '';

      if (oldContentElm) {
        content = this.querySelector('zs-tooltip-content').innerHTML;
      } else {
        content = this.innerHTML;
      }

      this.cleanUp();
      this.appendChild(document.createElement('zs-tooltip-content'));
      this.setContent(content);

      this._defineAnchor();

      this._addListeners();

      this._prepareArrow();

      this._prepare();

      this._isHidden = true;
      this.style.visibility = 'hidden';
      window.addEventListener('scroll', this._onScroll);
      window.addEventListener('resize', this._onResize);
      this.addEventListener("transitionend", this._whenAnimationFinished.bind(this), false);
      this.dispatchEvent(new CustomEvent('render'));
      return this;
    }
  };
  /**
   * @constructor
   * @extends HTMLElement
   * @extends zs.tooltip
   */
  // TODO: Import animate module instead of using zs.animate

  var tooltipElement = zs.customElement(HTMLElement, "zs-tooltip", null, [tooltip, zs.animate]); // Add tooltip behaviors to zs namespace for backward compatibility.

  window.zs = window.zs || {};
  window.zs.tooltip = tooltip;
  window.zs.tooltipElement = tooltipElement;
  var _default = {
    tooltip: tooltip,
    tooltipElement: tooltipElement
  };
  _exports.default = _default;
});
//# sourceMappingURL=tooltip.js.map
