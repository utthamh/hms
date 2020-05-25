var zs = (function (zs) {
	'use strict';

	/**
	 * Fixed column table behavior.
	 * @namespace
	 */
	zs.tableFixedColumns = {
		/**
		 * Number of columns to lock.
		 * @type {number}
		 */
		fixedColumnCount: 0,

		/**
		 * Reference to scroll element. Help to support virtual scrolling.
		 * @type {HTMLElement}
		 */
		scrollEl: null,

		/**
		 * Matches the scrolling of fixed container in parallel with scrollable container.
		 * @param {HTMLElement} fixedContainer Reference to fixed table container.
		 * @param {HTMLElement} scrollEl Reference to scroll element.
		 */
		matchScroll: function (fixedContainer, scrollEl) {
			if (!fixedContainer._scrollTop || fixedContainer._scrollTop != scrollEl.scrollTop) {
				fixedContainer._scrollTop = scrollEl.scrollTop;
				fixedContainer.scrollTop = scrollEl.scrollTop;
			}
		},

		/**
		 * Hook provided to decorate/apply styles to the fixed header cells.
		 * @param {HTMLElement} cell Fixed header cell element.
		 */
		decorateFixedHeaders: function (cell) {
			cell.setAttribute('locked', true);
		},

		/**
		 * Matches the width and height of the rows in the fixed column table and the normal (non-fixed) table.
		 * @param {HTMLElement} fixedContainer Reference to fixed table container.
		 */
		resizeFixed: function (fixedContainer) {
			if (!this.table || !fixedContainer) { return }

			var fixedTable = this.fixedTable || fixedContainer.firstElementChild;
			if (!fixedTable) { return; }

			var rows = this.table.querySelectorAll('tr');
			var fixedRows = fixedTable.querySelectorAll('tr');
			var comp = this;

			// Original table should be rendered before we can use that
			for (var i = 0; i < rows.length; i++) {
				var cell = rows[i].firstElementChild;
				var fixedCell = fixedRows[i].firstElementChild;
				var delta = rows[i].offsetHeight - fixedRows[i].offsetHeight;

				// We can't reduce row heights so we have to increase them only
				var newHeight = rows[i].clientHeight
				if (delta > 0) { // original row is higher
					newHeight = fixedRows[i].clientHeight + delta;
				} else if (delta < 0) { // fixed row is higher
					newHeight = rows[i].clientHeight - delta; // double negative
				}

				// We need to fix the height of both rows to protect from further manipulation of content like sorting.
				rows[i].style.minHeight = newHeight + 'px';
				fixedRows[i].style.minHeight = newHeight + 'px';
				rows[i].style.maxHeight = newHeight + 'px';
				fixedRows[i].style.maxHeight = newHeight + 'px';
				rows[i].style.height = newHeight + 'px';
				fixedRows[i].style.height = newHeight + 'px';
			}
		},
		scrollFix: function (elem) {

			//elem.style['-webkit-overflow-scrolling'] = 'touch';
			return;
			// Variables to track inputs
			var startY, startTopScroll;

			elem = elem || document.querySelector(elem);

			// If there is no element, then do nothing  
			if (!elem)
				return;

			// Handle the start of interactions
			elem.addEventListener('touchstart', function (event) {
				startY = event.touches[0].pageY;
				startTopScroll = elem.scrollTop;

				if (startTopScroll <= 0)
					elem.scrollTop = 1;

				if (startTopScroll + elem.offsetHeight >= elem.scrollHeight)
					elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
			}, false);
		},

		/**
		 * Override to split locked columns in the header.
		 * @param {HTMLElement} trFix Reference to the row in fixed table.
		 * @returns {HTMLElement} Returns rendered table row element.
		 */
		renderHeadRow: function (trFix) {
			var tr,
				rowData = this.headData || this.data[0],
				rowIndex = -1;

			tr = document.createElement('tr');
			tr.setAttribute('key', rowIndex);
			if (Array.isArray(rowData)) {
				for (var j = 0; j < rowData.length; j++) {
					var cell = this.renderHead(rowIndex, j, rowData[j]);
					if (this.fixedColumnCount > j) {
						trFix.appendChild(cell);
					} else {
						tr.appendChild(cell);
					}
				}
			} else {
				var jj = -1;
				for (var j in rowData) {
					jj++;
					var cell = this.renderHead(rowIndex, j, j);
					if (this.fixedColumnCount > jj) {
						trFix.appendChild(cell);
					} else {
						tr.appendChild(cell);
					}
				}
			}
			return tr;
		},

		/**
		 * Override to split locked columns in the table body.
		 * @param {number} rowIndex Index of the row.
		 * @param {(Array|object)} rowData Data required to render the row.
		 * @param {HTMLElement} trFix Reference to the row in fixed table.
		 * @param {HTMLElement} tr Reference to the row in normal (non-fixed) table.
		 * @returns {HTMLElement} Returns rendered table row element.
		 */
		renderRow: function (rowIndex, rowData, trFixed, tr) {
			if (rowData == null) { trFixed = null; return null; } // Skip row

			var j, tr = tr || document.createElement('tr');

			tr.setAttribute('key', rowIndex);

			if (Array.isArray(rowData)) {
				for (var j = 0; j < rowData.length; j++) {
					var cell = this.renderCell(rowIndex, j, rowData[j]);
					if (this.fixedColumnCount > j) {
						trFixed.appendChild(cell);
					} else {
						tr.appendChild(cell);
					}
				}
			} else {
				var jj = -1;
				for (var j in rowData) {
					jj++;
					var cell = this.renderCell(rowIndex, j, rowData[j]);
					if (this.fixedColumnCount > jj) {
						trFixed.appendChild(cell);
					} else {
						tr.appendChild(cell);
					}
				}
			}


			return tr;
		},

		/**
		 * Override renderTable to create a container for another table with locked columns
		 */
		renderTable: function (data, mode) {
			var i, body = '', comp = this, tableContainer;



			// Original render
			if (typeof comp.loadingSet == 'function') { comp.loadingSet(true, comp); } // hide spinner
			if (!this.tableContainer) {
				this.tableContainer = document.createElement('div');
				this.appendChild(this.tableContainer);
			}
			tableContainer = this.tableContainer;

			comp.scrollEl = tableContainer; // !!!

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

			// Define fixed container
			if (this.fixedColumnCount) {

				if (!this.fixedContainer) {
					this.fixedContainer = this.querySelector('.zs-fixed');
					if (!this.fixedContainer) {
						this.fixedContainer = document.createElement('div');
						this.appendChild(this.fixedContainer); // Important to append to overall container. Because we 
					}
				} else {
					this.fixedContainer.innerHTML = ''; // clear
				}


				// Create fixed table, head and body
				if (!this.fixedTable) {
					this.fixedTable = document.createElement('table');
					this.fixedTable.setAttribute('class', this.table.getAttribute('class'));
					this.fixedTable.style.tableLayout = 'fixed';

					this.fixedContainer.appendChild(this.fixedTable);
				} else {
					this.fixedTable.innerHTML = '';
				}


				this.fixedTableHead = document.createElement('thead');
				this.fixedTableBody = document.createElement('tbody');


				// Create a table container and move the table inside it
				this.fixedContainer.setAttribute('class', 'zs-fixed');
				this.fixedContainer.style.position = 'absolute';
				this.considerPosition('relative');

				this.fixedContainer.style.bottom = '0px';
				this.fixedContainer.style.left = '0px';
				this.fixedContainer.style.overflowY = 'hidden';
				this.fixedContainer.style.top = '0px';	// to make it inline with tablecontainer

				// Synchronize scroll 
				var waiting = false;
				comp.scrollEl.addEventListener('scroll', function (event) {
					if (!waiting) {
						waiting = true;

						window.requestAnimationFrame(function () {
							waiting = false;
							comp.matchScroll(comp.fixedContainer, comp.scrollEl);
						});
					}
				});

				// Disable iOS elastic scroll
				this.scrollFix(comp.scrollEl);


				// Listen to resize
				this.addEventListener('resize', function () {
					comp.resizeFixed(comp.fixedContainer, comp.scrollEl);
				});
			}



			// Headers			
			if (this.fixedColumnCount) {
				var trFix = document.createElement('tr');
				this.thead.appendChild(this.renderHeadRow(trFix));
				this.fixedTableHead.appendChild(trFix);
			} else {
				this.thead.appendChild(this.renderHeadRow());
			}

			var trFixed, tr;
			for (i = 0; i < data.length; i++) {

				if (this.fixedColumnCount) {
					trFix = document.createElement('tr');
					tr = this.renderRow(i, data[i], trFix);
				}
				if (tr) {
					this.tbody.appendChild(tr);
				}
				if (trFix) {
					this.fixedTableBody.appendChild(trFix);
				}
			}

			tableContainer.appendChild(this.table);

			if (this.fixedColumnCount) {
				this.fixedTable.appendChild(this.fixedTableHead);
				this.fixedTable.appendChild(this.fixedTableBody);
			}

			// Wait till render
			// this.whenRendered().then(function () {
			this.dispatchEvent(new CustomEvent("render"));

			// });
		},

		/**
		 * Event listeners.
		 */
		events: {
			render: function () {
				var comp = this;
				if (comp.fixedColumnCount) {
					comp.resizeFixed(comp.fixedContainer, comp.scrollEl);
					comp.matchScroll(comp.fixedContainer, comp.scrollEl);

					// Adjust width and height of locked columns table and main table
					this.tableContainer.style.marginLeft = comp.fixedContainer.offsetWidth + 'px';
					comp.fixedContainer.firstElementChild.style.marginBottom = '100px';// compensate for scrollbar should 										
					comp.fixedContainer.style.height = this.tableContainer.offsetHeight + 'px';

				}
				if (typeof comp.loadingSet == 'function') { comp.loadingSet(false, comp); } // hide spinner			
			}
		}
	}

	return zs;
})(window.zs || {});
