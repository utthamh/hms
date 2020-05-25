var zs = (function (zs) {
	'use strict';

	/**
	 * @class 		ZS TablePivot
	 * @classdesc 	Adds pivot behaviour to ZSTable. 
	 *  			Renders table in specific way according to provided dataset. 
	 * 				Main difference are styles and two headers instead of one comparing w/ basic table
	 */
	zs.tablePivot = {
		/**
		 * Renders table in specific way
		 */
		renderPivotTable: function () {
			this.table = document.createElement('table');
			this.table.className = 'zs-data-table';
			this.table.appendChild(this.renderPivotHead());
			this.table.appendChild(this.renderPivotBody());
			this.appendChild(this.table);

			//var comp = this;
			// this.whenRendered().then(function () {
			this.dispatchEvent(new CustomEvent('render'));
			// });
		},

		/**
		 * Render thead element for pivot table
		 * 
		 * @returns {Element} thead
		 */
		renderPivotHead: function () {
			this.thead = document.createElement('thead');

			return this.thead;
		},

		/**
		 * Render tbody element for pivot table
		 * 
		 * @returns {Element} tbody
		 */
		renderPivotBody: function () {
			this.tbody = document.createElement('tbody');

			return this.tbody;
		},

		/**
		 * Create th element by provided params
		 * 
		 * @param {Object} params
		 * @returns {Element}
		 */
		createPivotItem: function (params) {
			params = params || {};

			var elm = document.createElement(params.name);

			if (params.text) {
				elm.innerText = params.text;
			}

			if (params.className) {
				elm.className += ' ' + params.className;
			}

			if (params.style) {
				for (var style in params.style) {
					elm.style[style] = params.style[style];
				}
			}

			delete params.name;
			delete params.text;
			delete params.className;
			delete params.style;

			for (var key in params) {
				elm.setAttribute(key, params[key]);
			}

			return elm;
		}

	};
	
	return zs;
})(window.zs || {});
