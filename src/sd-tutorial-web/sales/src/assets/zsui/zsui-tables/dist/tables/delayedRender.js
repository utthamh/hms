var zs = (function (zs) {
	'use strict';

	/**
	 * Delayed table render behavior. This is useful to improve the table rendering performance by rendering the table rows in smaller subsets.
	 * @namespace
	 */
	zs.tableDelayedRender = {

		/**
		 * Number of rows to be rendered at a given time.
		 * @type {number}
		 */
		renderStep: 10,

		/**
		 * Stores the array of animation request IDs.
		 * @type {Array}
		 */
		animRequests: [],

		/**
		 * Renders the subset of rows within the table.
		 * @param {Array} data Table data
		 * @param {number} start Start index from where we need to render the rows
		 * @param {number} end End index to render the rows
		 */
		renderTableSection: function(data, start, end) {
			console.log('tableDelayedRender', 'renderTableSection', start, end);
            for (var i = start; i <= end; i++) {
                var tr = this.renderRow(i, data[i]);
                if (tr) { // We may render head row and return nothing
                    this.tbody.appendChild(tr);
                }
            }
		},

		/**
		 * Renders the table based on the provided data. Also, it creates all the required references and DOM elements if not already present.
		 */
		renderTable: function (data, mode) {
			console.log('tableDelayedRender', 'renderTable', data);
			var i,
				comp = this,
				body = '';

			var tableContainer = this.tableContainer || this;

			// Clear older animation requests in case of re-render.
			if (comp.animRequests && comp.animRequests.length) {
				for (var i = 0; i < comp.animRequests.length; i++) {
					window.cancelAnimationFrame(comp.animRequests[i]);
				}
				comp.animRequests = [];
			}

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

			var step = this.renderStep;
			if (step>comp.data.length) {step = comp.data.length;}
			var requestId;
			i=0;
			function run() {	
				if (i<data.length) {
					requestId = window.requestAnimationFrame(function() {
						if ((i + step) > data.length) {
							comp.renderTableSection(data, i, data.length - 1);
						} else {
							comp.renderTableSection(data, i, i + step - 1);
						}
						i+=step;
						run();
					});

					// Store animation requests, so that, we can clear them in case of re-render.
					comp.animRequests.push(requestId);
				} else {
					comp.dispatchEvent(new CustomEvent('render'));
				}
			}
			run();

			tableContainer.appendChild(this.table);

		}
	}

	
	
	/**
	 * Delayed fixed column table behavior. This is useful to improve the fixed column table rendering performance by rendering the table rows in smaller subsets.
	 * @namespace
	 */
	zs.tableFixedColumnsDelayed = {
		
		/**
		 * Number of rows to be rendered at a given time.
		 * @type {number}
		 */
		renderStep: 10,

		/**
		 * Stores the array of animation request IDs.
		 * @type {Array}
		 */
		animRequests: [],

		/**
		 * Renders the subset of rows within the table.
		 * @param {Array} data Table data
		 * @param {number} start Start index from where we need to render the rows
		 * @param {number} end End index to render the rows
		 * @param {HTMLElement} tbody Reference to the table body in normal (non-fixed) table.
		 * @param {HTMLElement} tbodyFixed Reference to the table body in fixed table.
		 */
		renderTableSection: function(data, start, end, tbody, tbodyFixed) {
			for (var i = start; i<=end; i++) {
				var trFix = document.createElement('tr');				
				var tr = this.renderRow(i, data[i], trFix);				
				if (tr) { // We may render head row and return nothing
					tbody.appendChild(tr);
				}
				if (trFix) {
					tbodyFixed.appendChild(trFix);
				}
			}
		},

		/**
		 * Renders the table based on the provided data. Also, it creates all the required references and DOM elements if not already present.
		 */
		renderTable: function (data, mode) {
			console.log('render fixed delayed')
			var i, body = '', comp = this, tableContainer;

			// Clear older animation requests in case of re-render.
			if (comp.animRequests && comp.animRequests.length) {
				for (var i = 0; i < comp.animRequests.length; i++) {
					window.cancelAnimationFrame(comp.animRequests[i]);
				}
				comp.animRequests = [];
			}


			// Original render
			if (comp.loadingSet) {
				comp.loadingSet(true, comp); // hide spinner
			}
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
			tableContainer.appendChild(this.table);
			
			if (this.fixedColumnCount) {
				this.fixedTable.appendChild(this.fixedTableHead);
				this.fixedTable.appendChild(this.fixedTableBody);
			}


			// Render sections
			var step = this.renderStep;
			if (step>comp.data.length) {step = comp.data.length;}
			var requestId;
			i=0;
			function run() {					
				if (i<comp.data.length) {
					requestId = window.requestAnimationFrame(function() {
						
						if ((i + step) > comp.data.length) {
							comp.renderTableSection(comp.data, i, comp.data.length - 1, comp.tbody, comp.fixedTableBody);
						} else {
							comp.renderTableSection(comp.data, i, i+step-1, comp.tbody, comp.fixedTableBody);
						}

						if (comp.fixedColumnCount) {
							comp.resizeFixed(comp.fixedContainer, comp.scrollEl);
							comp.matchScroll(comp.fixedContainer, comp.scrollEl);
		
							// Adjust width and height of locked columns table and main table
							tableContainer.style.marginLeft = comp.fixedContainer.offsetWidth + 'px';
							comp.fixedContainer.firstElementChild.style.marginBottom = '100px';// compensate for scrollbar should 										
							comp.fixedContainer.style.height = tableContainer.offsetHeight + 'px';
		
						}		
						i+=step;
						run();			
					});

					// Store animation requests, so that, we can clear them in case of re-render.
					comp.animRequests.push(requestId);
				} else {
					comp.loadingSet(false, comp); // hide spinner
					comp.dispatchEvent(new CustomEvent('render'));
				}
			}
			run();		
		}
	}

	return zs;
})(window.zs || {});