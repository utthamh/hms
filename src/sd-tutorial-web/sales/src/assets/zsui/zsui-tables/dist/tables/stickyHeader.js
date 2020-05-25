var zs = (function (zs) {
	'use strict';
	
	/**
	 * Sticky header behavior for the sticky header table.
	 * @namespace
	 */
	zs.tableStickyHeader = {
		
		/**
		 * Hook provided to decorate/apply styles to the sticky cell.
		 * @param {HTMLElement} cell Sticky cell element.
		 */
		decorateStickyCell: function (cell) {

		},

		/**
		 * Matches the width and height of headers in the sticky header and the table.
		 * @param {HTMLElement} targetTable Reference to table element.
		 * @param {HTMLElement} stickyContainer Reference to sticky cell container.
		 * @param {HTMLElement} scrollEl Reference to scroll element.
		 */
		resizeStickyHeader: function (targetTable, stickyContainer, scrollEl) {
			if (!stickyContainer || !targetTable || !scrollEl) { return; }
			// Need to match the width and height of headers in the sticky header and the table.
			// FF renders headers first and then resizes them.
			var cells = targetTable.querySelector('thead').querySelectorAll('td,th');
			var stickyCells = stickyContainer.querySelectorAll('td,th');

			for (var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				var stickyCell = stickyCells[i];
				if (stickyCell) {
					//stickyCell.style.display = 'inline-block';
					stickyCell.style.whiteSpace = 'normal'; // Because parent white-space is nowrap

					stickyCell.style.width = cell.clientWidth + (cell.offsetLeft - stickyCell.offsetLeft) + 'px'; // IE11 we need to compensate 
					stickyCell.style.height = cell.clientHeight + cell.offsetHeight - cell.clientHeight + 'px'; // Why?
					//alert(1);
					//console.log('cell', cell.clientWidth, cell.offsetLeft, stickyCell.offsetLeft);

					stickyCell.style.minWidth = stickyCell.style.width;
					stickyCell.style.maxWidth = stickyCell.style.width;

					this.decorateStickyCell(stickyCell);
				}
			}


			// Compensate for scrolling
			var delta = scrollEl.offsetWidth - scrollEl.clientWidth;
			var bar = stickyContainer.querySelector('[bar]');
			if (delta) {
				if (!bar) {
					bar = document.createElement('td');
					bar.setAttribute('bar', 'true');
					stickyContainer.firstElementChild.firstElementChild.firstElementChild.appendChild(bar);
				}
				bar.style.width = delta + 'px';

			} else if (bar) {
				stickyContainer.firstElementChild.firstElementChild.firstElementChild.removeChild(bar);
			}

			// Set position
			//var rect = scrollEl.getBoundingClientRect();

			var stickyHeaderHeight = stickyContainer.offsetHeight;
			var headerHeight = targetTable.querySelector('thead').offsetHeight;

			stickyContainer.style.left = '0px';
			stickyContainer.style.top = '0px';
			stickyContainer.style.marginLeft = scrollEl.style.marginLeft;

			if (stickyContainer.parentNode) {
				stickyContainer.parentNode.style.paddingTop = stickyHeaderHeight + 'px';
			}

			stickyContainer.style.width = scrollEl.offsetWidth + 'px';
			targetTable.style.marginTop = -headerHeight + 'px';


		},

		/**
		 * Scrolls the sticky container in parallel with scroll element.
		 * @param {HTMLElement} targetTable Reference to table element.
		 * @param {HTMLElement} stickyContainer Reference to sticky cell container.
		 * @param {HTMLElement} scrollEl Reference to scroll element.
		 */
		scrollStickyHeader: function (targetTable, stickyContainer, scrollEl) {
			if (!targetTable || !stickyContainer || !scrollEl) {
				return;
			}
			stickyContainer.scrollLeft = scrollEl.scrollLeft;
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
			if (this.table && this.table.stickyContainer) {
				while (this.table.stickyContainer.firstChild) {
					this.table.stickyContainer.removeChild(this.table.stickyContainer.firstChild);
				}
				this.table.stickyContainer = null;
			}
			if (this.table && this.table.parentNode) {
				this.table.parentNode.removeChild(this.table);
				this.table = null;
			}
		},

		/**
		 * Creates and renders the sticky portion of the table.
		 * @param {HTMLElement} targetTable Reference to table element.
		 * @param {HTMLElement} stickyContainer Reference to sticky cell container.
		 * @param {HTMLElement} scrollEl Reference to scroll element.
		 * @returns {HTMLElement} stickyContainer Reference to sticky container.
		 */
		stickHeader: function (targetTable, stickyContainer, scrollEl) {
			// Can be applied to any target table			
			var comp = this;

			// Can't work without proper parameters
			if (!targetTable || !scrollEl) {
				return;
			}

			if (!stickyContainer) {
				stickyContainer = targetTable.stickyContainer;
				if (!stickyContainer) {
					stickyContainer = document.createElement('div');
					stickyContainer.style.visibility = 'hidden';
					targetTable.stickyContainer = stickyContainer;
				}
			}

			if (stickyContainer && !targetTable.stickyContainer) {
				targetTable.stickyContainer = stickyContainer;
			}

			this.appendChild(stickyContainer);

			// Clear sticky container
			if (stickyContainer.firstElementChild) {
				stickyContainer.removeChild(stickyContainer.firstElementChild);
			}

			// Style sticky header
			stickyContainer.classList.add('zs-sticky');
			stickyContainer.style.overflowX = 'hidden';
			stickyContainer.style.position = 'absolute';
			stickyContainer.parentNode.style.position = 'relative';

			// Listen to scroll to shift the sticky header.
			var waiting = false;
			scrollEl.addEventListener('scroll', function (event) {
				if (!waiting) {
					waiting = true;
					window.requestAnimationFrame(function () {
						waiting = false;
						comp.scrollStickyHeader(targetTable, stickyContainer, scrollEl);
					});
				}
			});

			// Duplicate table headers
			var thead = targetTable.querySelector('thead').cloneNode(true);
			var table = document.createElement('table');
			table.classList.add('zs-data-table');
			table.appendChild(thead);
			targetTable.style.tableLayout = 'fixed';


			stickyContainer.appendChild(table);
			//stickyContainer.firstElementChild.style.display = 'block'; // table
			stickyContainer.firstElementChild.style.marginBottom = '0';


			//stickyContainer.firstElementChild.firstElementChild.style.display = 'block'; // thead
			if (stickyContainer.firstElementChild.firstElementChild.firstElementChild) { // If we have tr
				//stickyContainer.firstElementChild.firstElementChild.firstElementChild.style.display = 'block'; // tr
				stickyContainer.firstElementChild.firstElementChild.firstElementChild.style.whiteSpace = 'nowrap';
			}

			// Yield to IE11
			setTimeout(function () {
				comp.resizeStickyHeader(targetTable, stickyContainer, scrollEl);
				comp.scrollStickyHeader(targetTable, stickyContainer, scrollEl);
				stickyContainer.style.visibility = 'visible';
				if (targetTable.parentNode && targetTable.parentNode.classList.contains("zs-fixed")) {
					targetTable.parentNode.style.top = "";
				}
			}, 0); // Issue: IE11 might require longer delay

			return stickyContainer;
		}

	};
	return zs;
})(window.zs || {});
