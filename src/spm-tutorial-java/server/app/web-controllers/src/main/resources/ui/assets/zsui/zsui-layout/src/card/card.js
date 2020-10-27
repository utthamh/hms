var zs = (function (zs) {
	'use strict';
	/**
 	 * @namespace 
 	 */
	zs.card = {
		/**
		 * Reference to header element.
		 * @type {HTMLElement}
		 */
		headerEle: null,
		/**
		 * Reference to section element.
		 * @type {HTMLElement}
		 */
		sectionEle: null,
		/**
		 * Reference to footer element.
		 * @type {HTMLElement}
		 */
		footerEle: null,
		/**
		 * Reference to back face header element of flippable card.
		 * @type {HTMLElement}
		 */
		backHeaderEle: null,
		/**
		 * Reference to back face section element of flippable card.
		 * @type {HTMLElement}
		 */
		backSectionEle: null,
		/**
		 * Reference to back face footer element of flippable card.
		 * @type {HTMLElement}
		 */
		backFooterEle: null,
		/**
		 * Reference to container of flippable card.
		 */
		flipCardContainer: null,
		/**
		 * Reference to container of front face of flippable card.
		 */
		frontFaceContainer: null,
		/**
		 * Reference to container of back face of flippable card.
		 */
		backFaceContainer: null,
		/**
		 * Reference to function called when a card is flipped.
		 */
		onFlip: null,
		/**
         * @private
         * @type {String}
         */

		_filter: null,
		/**
		 * Contains the getter and setter of the properties 'isFilter' and 'isFlippable'.
		 * getter of 'filter' returns the value of filter attribute. And its setter sets the value of 'filter' attribute as required.
		 */
		properties: {
			filter: {
				set: function (value) {
					this._checkAndUpdateAttrByProp('filter', value);
					this._filter = value;
				},
				get: function () {
					return this._filter;
				}
			}
		},
		/**
		 * This checks the properties and update the attributes accordingly.
		 */
		_checkAndUpdateAttrByProp: function (name, value) {
			if (value == this.getAttribute(name)) {
				return this;
			}
			this.setAttribute(name, value);
			return this;
		},
		/**
		 * This checks the attributes and update the properties accordingly.
		 */
		_checkAndUpdatePropByAttr: function (name, value) {
			if (!this.properties.hasOwnProperty(name)) {
				return this;
			}
			var currentValue = '' + this[name];
			if (currentValue == value) {
				return this;
			}
			this[name] = value;
			return this;
		},
		/**
		 * Adds an icon to flip the card content if the card is flippable.
		 */
		renderFlipCard: function () {
			if (!this.flipCardContainer) {
				this.flipCardContainer = this.querySelector('.zs-flip-card');
				if (!this.flipCardContainer) {
					this.flipCardContainer = document.createElement('div');
					this.flipCardContainer.classList.add('zs-flip-card');
					this.appendChild(this.flipCardContainer);
				}
			}
			if (!this.frontFaceContainer) {
				this.frontFaceContainer = this.querySelector('.front');
				if (!this.frontFaceContainer) {
					this.frontFaceContainer = document.createElement('div');
					this.frontFaceContainer.classList.add('front');
					var headerElement = this.renderHeader();
					var sectionElement = this.renderSection();
					var footerElement = this.renderFooter();
					var titleSpan = document.createElement('span');
					if (headerElement) {
						headerElement.appendChild(titleSpan);
						this.frontFaceContainer.appendChild(headerElement);
					}
					if (sectionElement) {
						this.frontFaceContainer.appendChild(sectionElement);
					};
					if (footerElement) {
						this.frontFaceContainer.appendChild(footerElement);
					}

					this.flipCardContainer.appendChild(this.frontFaceContainer);
				}
			}
			if (!this.backFaceContainer) {
				this.backFaceContainer = this.querySelector('.back');
				if (!this.backFaceContainer) {
					this.backFaceContainer = document.createElement('div');
					this.backFaceContainer.classList.add('back');
					var headerElement = this.renderBackHeader();
					var sectionElement = this.renderBackSection();
					var footerElement = this.renderBackFooter();
					var backTitleSpan = document.createElement('span');
					if (headerElement) {
						headerElement.appendChild(backTitleSpan);
						this.backFaceContainer.appendChild(headerElement);
					}
					if (sectionElement) {
						this.backFaceContainer.appendChild(sectionElement);
					};
					if (footerElement) {
						this.backFaceContainer.appendChild(footerElement);
					}
					this.flipCardContainer.appendChild(this.backFaceContainer);
				}
			}
			this.renderFlipIcon();
		},
		renderFlipIcon: function () {
			var self = this;
			var allHeaders = this.querySelectorAll('header');
			if (allHeaders.length == 0) {
				return;
			}
			for (var i = 0; i < allHeaders.length; i++) {
				var checkIcon = allHeaders[i].querySelector(".zs-icon-frame-next");
				if (!checkIcon) {
					var anchorFlipIcon = document.createElement('a');
					anchorFlipIcon.classList.add("zs-icon");
					anchorFlipIcon.classList.add("zs-icon-frame-next");
					anchorFlipIcon.classList.add("zs-card-icon");
					anchorFlipIcon.addEventListener('click', function () {
						self.flipCard();
					});
					allHeaders[i].appendChild(anchorFlipIcon);
				}
			}
		},
		/**
		 * This gets called whenever we will click on flip icon. It will flip the position of the card. 
		 */
		flipCard: function () {
			var checkFlip = (this.getAttribute('flip')) !== null;
			var isFlippable = this.hasAttribute('flippable');
			if ((isFlippable) && !(checkFlip)) {
				this.setAttribute('flip', '');
			}
			else if ((isFlippable) && (checkFlip)) {
				this.removeAttribute('flip');
			}
			if (typeof this.onFlip == 'function') {
				this.onFlip();
			}
		},
		/**
		 * Renders the header element with the title as inner text if title attribute is there.
		 */
		renderHeader: function () {
			if (!this.headerEle) {
				this.headerEle = this.querySelector('header');
				if (!this.headerEle) {
					this.headerEle = document.createElement('header');
					return this.headerEle;
				}
			}
		},
		/**
		 * Renders the section element of the component.
		 */
		renderSection: function () {
			if (!this.sectionEle) {
				this.sectionEle = this.querySelector('section');
				if (!this.sectionEle) {
					this.sectionEle = document.createElement('section');
					//this.appendChild(this.sectionEle);
					return this.sectionEle;
				}
			}
		},
		/**
		 * Renders the footer element of the component.
		 */
		renderFooter: function () {
			if (!this.footerEle) {
				this.footerEle = this.querySelector('footer');
				if (!this.footerEle) {
					this.footerEle = document.createElement('footer');
					return this.footerEle;
				}
			}
		},
		/**
		 * Renders the back face footer element of the flippable card component.
		 */
		renderBackHeader: function () {
			if (!this.backHeaderEle) {
				this.backHeaderEle = this.querySelector('.back header');
				if (!this.backHeaderEle) {
					this.backHeaderEle = document.createElement('header');
					return this.backHeaderEle;
				}
			}
		},
		/**
		 * Renders the back face section element of the flippable card component.
		*/
		renderBackSection: function () {
			if (!this.backSectionEle) {
				this.backSectionEle = this.querySelector('.back section');
				if (!this.backSectionEle) {
					this.backSectionEle = document.createElement('section');
					return this.backSectionEle;
				}
			}
		},
		/**
		 * Renders the back face footer element of the flippable card component.
		 */
		renderBackFooter: function () {
			if (!this.backFooterEle) {
				this.backFooterEle = this.querySelector('.back footer');
				if (!this.backFooterEle) {
					this.backFooterEle = document.createElement('footer');
					return this.backFooterEle;
				}
			}
		},
		/**
		 * Add zs-card class to the component if not there already. 
		 */
		addClass: function () {
			this.classList.add('zs-card');
		},
		/**
		 * Sets the height of flippable card equals to the maximum height of faces of the card.
		 */
		setHeight: function () {
			var heightOfFrontFace = this.querySelector('.front').offsetHeight;
			var heightOfBackFace = this.querySelector('.back').offsetHeight;
			this.style.height = Math.max(heightOfFrontFace, heightOfBackFace) + "px";
		},
		cleanup: function () {
			this.headerEle = null;
			this.sectionEle = null;
			this.footerEle = null;
			this.backHeaderEle = null;
			this.backSectionEle = null;
			this.backFooterEle = null;
			this.flipCardContainer = null;
			this.frontFaceContainer = null;
			this.backFaceContainer = null;
			this._filter = null;
			this.innerHTML = "";
		},
		/**
		 * Renders the card component. 
		 */
		render: function () {
			this.addClass();
			if (this.hasAttribute('flippable')) {
				this.renderFlipCard();
				this.setHeight();
			}
			else {
				var headerElement = this.renderHeader();
				var sectionElement = this.renderSection();
				var footerElement = this.renderFooter();
				if (headerElement) {
					this.appendChild(headerElement);
				}
				if (sectionElement) {
					this.appendChild(sectionElement);
				};
				if (footerElement) {
					this.appendChild(footerElement);
				}
			}
		},
		/**
		 * Observes the attributes present in the array.
		 */
		observedAttributes: ['filter'],
		/**
		 * Provides callback handles for events attach and click.
		 * attach is called when the component gets attached.
		 * click is called when click event is performed on the component.
		 * attributeChange is called when any attributes present in observedAttributes array gets created, deleted or changed.   
		 */
		events: {
			attach: function (e) {
				this.render();
			},
			click: function (e) {
				var hasFilter = this.hasAttribute('filter');
				var filterValue = this.getAttribute('filter');
				if ((hasFilter) && !(filterValue == 'on')) {
					this.filter = 'on';
				}
				else if ((hasFilter) && (filterValue)) {
					this.filter = '';
				}
			},
			attributeChange: function (event) {
				this._checkAndUpdatePropByAttr(event.detail.attributeName, event.detail.newValue);
			},
			detach: function () {
				this.cleanup();
			}
		},
	};

	zs.cardElement = zs.customElement(HTMLElement, 'zs-card', null, [zs.card]);

	return zs;
})(window.zs || {});