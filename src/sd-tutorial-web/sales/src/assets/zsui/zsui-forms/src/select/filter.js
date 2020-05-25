
var zs = (function (zs) {
	'use strict';

	/**
	 * ZS Filter component
	 * @namespace
	 */
	zs.filter = {
		/**
		 * Reference to div element contains select element.
		 * @type {HTMLElement}
		 */
		selectContainer: null,
		/**
		 * Reference to select element.
		 * @type {HTMLElement}
		 */
		selectEle: null,
		/**
		 * Reference to an object that contains value , name and selected attributes of options. 
		 */
		optionData: null,
		/**
         * @private
         * @type {String}
         */
		_label: null,
		/**
         * @private
         * @type {String}
         */
		_isRendered: null,
		/**
         * @private
         * @type {Object}
		 * Reference to the plugin
         */
		_pluginRef: null,
		/**
		 * Contains the getter and setter of the property 'label'.
		 * getter of 'label' returns the value of label attribute. And its setter sets the value of 'label' attribute as required.
		 */
		properties: {
			label: {
				set: function (value) {
					this._label = String(value);
					if (this.getAttribute('label') != String(this._label)) {
						this.setAttribute('label', this._label);
						if (this._isRendered) {
							this.update();
						}
					}
				},
				get: function () {
					return this._label || '';
				}
			},
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

			if (this._isRendered) {
				this.update();
			}
			return this;
		},
		/**
		 * This function sets the label of the filter.
		 */
		setLabel: function () {
			var nameContainer = this.querySelector('[overlay]');
			nameContainer.innerHTML = '<span></span><span class="zs-icon zs-icon-collapse zs-filter-icon"></span>';
			nameContainer.querySelector("span").textContent = this.label;
		},
		/**
		 * This function changes the label of the filter on changing the options of filters. This can be override as per need.
		 */
		changeLabel: function (arr, name) {
			if (arr.length == 0) {
				this.setLabel();
				return;
			}
			
			var nameContainer = this.querySelector('[overlay]');
			if (this.hasAttribute('single')) {
				nameContainer.innerHTML = '<span></span><span class="zs-icon zs-icon-collapse zs-filter-icon"></span>';
				nameContainer.querySelector("span").textContent = "" + arr;
			}
			else if(arr.length == 1) {
				nameContainer.innerHTML = '<span></span><span class="zs-icon zs-icon-collapse zs-filter-icon"></span>';
				nameContainer.querySelector("span").textContent = "" + arr.toString();
			}
			else{
				nameContainer.innerHTML = '<span></span><span class="zs-icon zs-icon-collapse zs-filter-icon"></span>';
				nameContainer.querySelector("span").textContent = "" + arr.length + " " + name;
			}
		},
		getOverlayHeight: function () {
			return this.querySelector('[overlay]').offsetHeight;
		},
		/**
		 * This is reqiured to get the values of selected options
		 */
		getSelectedValue: function(){
			return this._pluginRef.$select.val();
		},
		/**
		 * This clears all the selections of the filter
		 */
		clearAllSelection: function(){
			this._pluginRef.clearAllSelection();
		},
		/**
		 * It renders the dropdown of the filter.
		 */
		renderDropdown: function () {
			if (!this.selectContainer) {
				this.selectContainer = this.querySelector('.zs-select');
				if (!this.selectContainer) {
					this.selectContainer = document.createElement('div');
					this.selectContainer.classList.add('zs-select');
					this.appendChild(this.selectContainer);
				}
				if (!this.selectEle) {
					this.selectEle = this.selectContainer.querySelector('select');
					if (!this.selectEle) {
						this.selectEle = document.createElement('select');
						if(!this.getAttribute('single')){
							this.selectEle.setAttribute('multiple','');
						}
						this.getOptions();
						this.selectContainer.appendChild(this.selectEle);
					}
				}
			}
			var self = this;
			var isMultiple = true;
			var checkboxReqd = true;
			var selectAllReqd = false;
			if (this.hasAttribute('single')) {
				isMultiple = false;
				checkboxReqd = false;
			}
			if (this.hasAttribute('selectall')) {
				selectAllReqd = true;
			}
			$(this.selectContainer).find('select').zsSearchDropdown({
				multiple: isMultiple,
				addCheckboxes: checkboxReqd,
				addSelectAll: selectAllReqd,
				events: {
					change: function () {
						if (!self._isRendered) {
							return;
						}
						var overlayContainer = self.querySelector('[overlay]').innerHTML;
						var overlayArr = overlayContainer.split(',');
						var overlayArrLength = overlayArr.length;
						if (overlayArrLength == 1 && overlayArr[0] == "Select value") {
							overlayArr = [];
						}
						self.changeLabel(overlayArr, 'Items selected');
						var valArr = self.getSelectedValue();	
						var event = new CustomEvent('change');
						
						event.details = {
							value: valArr || [],
							names: overlayArr || []
						};
						self.dispatchEvent(event);
					},
					open: function () {
						if (!self._isRendered){
							return;
						}
						self.querySelector('.zs-search-dropdown').style.top = self.getOverlayHeight() - 1 + "px";
						self.querySelector('.zs-search-dropdown').style.left = "1px";
						var valArr = self.getSelectedValue();
						var event = new CustomEvent('open');
						event.details = {
							value: valArr || []
						};
						self.dispatchEvent(event);
					},
					beforeOpen: function () {
						if (!self._isRendered){
							return;
						}
						self.querySelector('.zs-select').classList.add('zs-filter-open');
						var valArr = self.getSelectedValue();
						var event = new CustomEvent('beforeOpen');
						event.details = {
							value: valArr || []
						};
						self.dispatchEvent(event);
					},
					beforeClose: function () {
						if (!self._isRendered){
							return;
						}
						self.querySelector('.zs-select').classList.remove('zs-filter-open');
						var valArr = self.getSelectedValue();
						var event = new CustomEvent('beforeClose');
						event.details = {
							value: valArr || []
						};
						self.dispatchEvent(event);
					},
					close: function(){
						if (!self._isRendered){
							return;
						}
						var valArr = self.getSelectedValue();
						var event = new CustomEvent('close');
						event.details = {
							value: valArr || []
						};
						self.dispatchEvent(event);
					}
				}
			});
			this._pluginRef = $(this).find('select').data('zsSearchDropdown');
			this.addEventListener('click',function(e){
				var overlay = self.querySelector('[overlay]');
				if (overlay && overlay.contains(e.target) && $(self).find(".zs-search-dropdown").is(":visible") == true){
					e.stopPropagation();
					$(self).find('select').data('zsSearchDropdown').close();
				}
			},true);
			this.renderLabel();
		},
		/**
		 * It renders the label of the filter.
		 */
		renderLabel: function () {
			if (this._pluginRef.$select.val().length) {
				var overlayText = this._pluginRef.getOverlayText();
				var overlayArr = overlayText.split(',');
				this.changeLabel(overlayArr, 'Items selected');
			} else {
				this.setLabel();
			}
		},
		/**
		 * It appends the options with its attribute to select element.  
		 */
		getOptions: function () {
			for (var i = 0; i < this.optionData.length; i++) {
				var optionEle = document.createElement('option');
				optionEle.setAttribute('value', this.optionData[i].value);
				optionEle.textContent = this.optionData[i].name;
				if (this.optionData[i].selected) {
					optionEle.setAttribute('selected', '');
				}
				if (this.optionData[i].disabled) {
					optionEle.setAttribute('disabled', '');
				}
				this.selectEle.appendChild(optionEle);
			}
		},
		/**
		 * It is required to clean up the custom element if required.
		 */
		cleanup: function () {
			this.selectContainer = null;
			this.selectEle = null;
			this.innerHTML = "";
		},
		/**
		 * This updates the filter whenever needed.
		 */
		update: function () {
			if (this.optionData) {
				this._isRendered = false;
				this.cleanup();
				this.render();
			}
			else {
				this._pluginRef.update();
				this.renderLabel();
			}
		},
		/**
		 * It renders the filter component.
		 */
		render: function () {
			this.renderDropdown();
			this._isRendered = true;
		},

		observedAttributes: ['label'],
		/**
		 * Supported events
		 */
		events: {
			create: function (e) {
				this._isRendered = false;
			},

			attach: function (e) {
				this.render();
			},

			change: function (e) {
				
			},

			attributeChange: function (event) {
				this._checkAndUpdatePropByAttr(event.detail.attributeName, event.detail.newValue);
			},

			detach: function (e) {
				this._pluginRef.destroy();
			},
		}
	};


	zs.filterElement = zs.customElement(HTMLElement, 'zs-filter', null, [zs.filter]);

	return zs;
})(window.zs || {});