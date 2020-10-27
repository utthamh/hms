var zs = (function (zs) {
	'use strict';

	/**
	 * Table behavior. Custom data table prototype.
	 * @namespace
	 */
	zs.table = {
		/**
		 * Required data to render the table.
		 * @type {Array}
		 */
		data: null,

		/**
		 * Table container reference element
		 * @type {HTMLElement}
		 */
		tableContainer: null,

		/**
		 * Event listeners.
		 */
		events: {
			create: function () {
				this.data = [];
			}
		},

		/**
		 * Renders the table with the assigned data.
		 */
		render: function () {
			this.renderTable(this.data);
		},

		/**
		 * Re-renders the table with updated data.
		 * @param {object} params Parameters to fetch the new data.
		 */
		refreshTable: function (params) {
			var comp = this;
			this.getTableData(params).then(function (data) {
				comp.data = data;
				comp.renderTable(data);
				if (typeof comp.loadingSet == 'function') { comp.loadingSet(false, comp.querySelector('.zs-table')); }
			});
		},

		/**
		 * Gets the required data to render the table.
		 * @param {object} params Parameters to fetch the new data.
		 * @returns {Promise} Promise object representing the data.
		 */
		getTableData: function (params) {
			var prom = new Promise(function (resolve, reject) {
				resolve([]);
			});
			return prom;
		},

		/**
		 * Manipulates the position of table element.
		 */
		considerPosition: function (position) {
			if (!this.style.position || !this.style.position == 'auto') { this.style.position = 'relative'; }
		},

		/**
		 * Creates and renders a table row.
		 * @param {number} rowIndex Index of the row.
		 * @param {(Array|object)} rowData Data required to render the row.
		 * @returns {HTMLElement} Returns HTML tr element.
		 */
		renderRow: function (rowIndex, rowData) {
			var tr = document.createElement('tr');
			tr.setAttribute('key', rowIndex);
			if (Array.isArray(rowData)) {
				for (var j = 0; j < rowData.length; j++) {
					tr.appendChild(this.renderCell(rowIndex, j, rowData[j]));
				}
			} else {
				for (var j in rowData) {
					tr.appendChild(this.renderCell(rowIndex, j, rowData[j]));
				}
			}
			return tr;
		},

		/**
		 * Creates and renders the table header row.
		 * @returns {HTMLElement} Returns HTML tr element.
		 */
		renderHeadRow: function () {
			var tr,
				rowData = this.headData || this.data[0],
				rowIndex = -1;

			tr = document.createElement('tr');
			tr.setAttribute('key', rowIndex);
			if (Array.isArray(rowData)) {
				for (var j = 0; j < rowData.length; j++) {
					tr.appendChild(this.renderHead(rowIndex, j, rowData[j]));
				}
			} else {
				for (var j in rowData) {
					tr.appendChild(this.renderHead(rowIndex, j, j));
				}
			}
			return tr;
		},

		/**
		 * Creates and renders the header cell.
		 * @param {number} rowIndex Index of the row.
		 * @param {number} colIndex Index of the column.
		 * @param {any} data Cell data based on the table data array.
		 * @returns {HTMLElement} Returns HTML td element.
		 */
		renderHead: function (rowIndex, colIndex, data) {
			var th = document.createElement('td');
			th.setAttribute('key', colIndex);
			th.innerHTML = data;
			return th;
		},

		/**
		 * Creates and renders the table body cell.
		 * @param {number} rowIndex Index of the row.
		 * @param {number} colIndex Index of the column.
		 * @param {any} data Cell data based on the table data array.
		 * @returns {HTMLElement} Returns HTML td element.
		 */
		renderCell: function (rowIndex, colIndex, data) {
			var td = document.createElement('td');
			td.setAttribute('key', colIndex);
			td.innerHTML = data;
			return td;
		},

		/**
		 * Clears the table DOM and corresponding stored references.
		 */
		clearTable: function () {
			if (this.thead) {
				while (this.thead.firstChild) {
					this.thead.removeChild(this.thead.firstChild);
				}
				this.thead = null;
			}
			if (this.tbody) {
				while (this.tbody.firstChild) {
					this.tbody.removeChild(this.tbody.firstChild);
				}
				this.tbody = null;
			}
			if (this.table && this.table.parentNode) {
				this.table.parentNode.removeChild(this.table);
				this.table = null;
			}
		},

		/**
		 * Renders the table based on the provided data. Also, it creates all the required references and DOM elements if not already present.
		 */
		renderTable: function (data, mode) {
			var i,
				comp = this,
				body = '';

			var tableContainer = this.tableContainer || this;

			// Empty table
			this.clearTable();

			// Create table
			if (!this.table) {
				this.table = this.querySelector('table') || document.createElement('table');
				this.table.classList.add('zs-data-table');
				this.table.style.tableLayout = 'fixed';
			}

			// Create thead and tbody
			if (!this.thead) {
				this.thead = this.table.querySelector('thead') || document.createElement('thead');
				this.table.appendChild(this.thead);
			}
			if (!this.tbody) {
				this.tbody = this.table.querySelector('tbody') || document.createElement('tbody');
				this.table.appendChild(this.tbody);
			}

			// Headers
			this.thead.appendChild(this.renderHeadRow());

			for (i = 0; i < data.length; i++) {
				var tr = this.renderRow(i, data[i]);
				if (tr) { // We may render head row and return nothing
					this.tbody.appendChild(tr);
				}
			}

			tableContainer.appendChild(this.table);

			comp.dispatchEvent(new CustomEvent('render'));
		},
		/**
		 * Override whenRendered to account for second table.
		 *
		 * @deprecated since v3.1.0
		 * will be deleted in v4.0.0		 
		 */
		whenRendered: function () {
			// Use this method to detect and trigger browser to finish rendering of our component
			var comp = this;

			console.warn("WARNING! Deprecated function called. Function 'whenRendered' has been deprecated, please listen to 'render' event instead to perform operations after element render.");
			
			return new Promise(function (resolve, reject) {
				setTimeout(function () { // Set timeout required for IE11
					if (!comp.table) { resolve(); return; }
					var tbody = comp.table.querySelector('tbody'); // Need to use querySelector for FF instead of just comp.tbody;
					if (!tbody) { resolve(); return; }
					var lastTr = tbody.lastChild;
					if (!lastTr) { resolve(); return; }
					var lastTd = lastTr.lastChild;
					var height1 = lastTd && lastTd.offsetHeight;
					var height2 = 0;
					var tableHeight1 = comp.table.offsetHeight;

					if (comp.fixedTable) {
						tbody = comp.fixedTable.querySelector('tbody');
						if (!tbody) { resolve(); return; }
						lastTr = tbody.lastChild;
						if (!lastTr) { resolve(); return; }
						var lastTd = lastTr.lastChild;
						var height2 = lastTd && lastTd.offsetHeight;
						var tableHeight2 = comp.fixedTable.offsetHeight;

					}
					resolve(height1 + ',' + height2 + ',' + tableHeight1 + ',' + tableHeight2);
				}, 0);
			});
		}
	};

	zs.tableElement = zs.customElement(HTMLDivElement, 'zs-table', 'div', [zs.loading, zs.table]);

	return zs;
})(window.zs || {});	
