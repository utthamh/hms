var zs = (function (zs) {
	'use strict';
	/**
	 * @namespace
	 */
	zs.tab = {

		anchorEle: null,
		/**
		 * Renders the tab element
		 */
		render: function () {
			if (!this.anchorEle) {
				this.anchorEle = this.querySelector('a');

				if (!this.anchorEle) {
					this.anchorEle = document.createElement('a');
					this.appendChild(this.anchorEle);
				}
			}
			this.dispatchEvent(new CustomEvent('render'));
		},
		/** Observes "tab-id" and "active" attribute when changed */
		observedAttributes: ['tab-id', 'active'],
		/**Provides callback handles for events such as attach, detach, create ,attributeChange, etc. */
		events: {
			attributeChange: function (e) {
				var attributeName = e.detail.attributeName;
				if (attributeName == 'tab-id') {
					this.tabId = this.getAttribute('tab-id');
				}
				if (attributeName == 'active') {
					this.isActive = (this.getAttribute('active') !== null);
				}
			},
			attach: function (e) {
				var self = this;
				setTimeout(function () {
					self.render();
				}, 0);
			}
		},
		/**
		 * Contains getter and setter of "tabId" and "isActive" properties
		 */
		properties: {
			tabId: {
				set: function (newValue) {
					if (newValue != this.getAttribute('tab-id')) {
						this.setAttribute('tab-id', newValue);
					}

					this._tabId = newValue;
				},
				get: function () {
					return this._tabId == null ? '' : this._tabId;
				}
			},
			isActive: {
				set: function (newValue) {
					if (newValue != this.isActive) {
						if (newValue) {
							this.setAttribute('active', '');
						} else {
							this.removeAttribute('active');
						}
					}
				},
				get: function () {
					return this.hasAttribute('active');
				}
			}
		}

	}

	zs.tabElement = zs.customElement(HTMLLIElement, 'zs-tab', 'li', [zs.tab]);


	/**
	 * @namespace
	 */
	zs.tabsContainer = {

		tabsContainer: null,

		renderTabsContainer: function () {
			if (!this.tabsContainer) {
				this.tabsContainer = this.querySelector('ul');

				if (!this.tabsContainer) {
					this.tabsContainer = document.createElement('ul');
					this.appendChild(this.tabsContainer);
				}
			}
		},
		/**
		 * Renders the tab container. 
		 */
		render: function () {
			this.renderTabsContainer();
			this.classList.add('zs-tabs');
			this.dispatchEvent(new CustomEvent('render'));
		},
		/**
		 * Navigates to the tab which is being clicked.
		 * @param tabElement {HTMLElement} parent of the clicked target element. 
		 */
		navigateTo: function (tabElement) {

			if (tabElement instanceof zs.tabElement) {
				// Show active tab
				var activeTab = this.tabsContainer.querySelector('[active]');
				if (activeTab) {
					activeTab.isActive = false;
				}
				tabElement.isActive = true;

				// Show corresponding panel
				var panels = this.querySelectorAll('[source-id]');
				for (var i = 0; i < panels.length; i++) {
					var panel = panels[i];

					// The panel should be immediate child of the component. It could return multiple panels in case of nested tabs.
					if (panel.parentElement == this) {
						if (panel.getAttribute('source-id') == tabElement.tabId) {
							panel.style.display = 'block';
						} else {
							panel.style.display = 'none';
						}
					}
				}

			}
		},
		/**
		 * Provides callback handles for attach and click events
		 */
		events: {
			attach: function (e) {
				var self = this;
				setTimeout(function () {
					self.render();
				}, 0);
			},

			click: function (e) {
				this.navigateTo(e.target.parentElement);
			}
		}

	}

	zs.tabsContainerElement = zs.customElement(HTMLElement, 'zs-tabs-container', null, [zs.tabsContainer]);

	return zs;
})(window.zs || {});
