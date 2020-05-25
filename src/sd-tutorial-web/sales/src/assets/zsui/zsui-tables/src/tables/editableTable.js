var zs = (function (zs) {
	'use strict';

	/** 
	 * Editable table behavior. Helps with a case when we want to edit data in a table that could have many rows and columns.This approach will initially display all data in read mode. But when user clicks on a cell it will see an edit mode for the selected field.
	 * @namespace  
	 */
	zs.tableEditable = {

		/**
		 * Reference element
		 * @type {object}
		 */
		overlayElement: null,

		/**
		 * How the data should be displayed in a cell in the read mode
		 * @param {any} data Cell data based on the table data array.
		 * @param {number} rowIndex Index of the row.
		 * @param {number} colIndex Index of the column
		 * @return {string} HTML code
		 */
		formatCell: function (data, rowIndex, colIndex) {
			return data;
		},

		/**
		 * Detects if cell is editable or not. You can override this with some custom logic.
		 * @param {any} data Cell data based on the table data array
		 * @param {number} rowIndex Index of the row.
		 * @param {number} colIndex Index of the column.
		 * @returns {boolean} Returns true is cell is editable.
		 */
		isEditable: function (data, rowIndex, colIndex) {
			return true;
		},

		/**
		 * A modified method to create a table cell based on the original 
		 * @param {number} rowIndex Index of the row.
		 * @param {number} colIndex Index of the column
		 * @param {any} data Cell data based on the table data array
		 * @see zs.table.renderCell
		 * @returns {HTMLElement} Cell element
		 * @override
		 */
		renderCell: function (rowIndex, colIndex, data) {
			var td = document.createElement('td');
			td.setAttribute('key', colIndex);
			if (this.isEditable(data, rowIndex, colIndex)) { // Not every cell will be editable
				td.setAttribute('edit', '');
				td.innerHTML = '<p class="zs-cell">' + this.formatCell(data, rowIndex, colIndex) + '</p>';
			} else {
				td.innerHTML = this.formatCell(data, rowIndex, colIndex);
			}
			return td;
		},

		/**
		 * Put an editable field in focus
		 */
		focusEditField: function () {
			if (!this.overlayElement) { return; }
			var field = this.overlayElement.querySelector('[tabindex="2"]'); // TODO:
			if (field) { field.focus(); }
		},

		/**
		 * Move focus to the next editable field in the table
		 */
		nextField: function () {
			var td = this.overlayElement._lastTd; // Could be different based on the field type
			var $nextTd = $(td).nextAll('[edit]');
			if (!$nextTd.length) {
				var tr = td.parentNode;
				if (!tr.nextSibling) { return; }
				$nextTd = $(tr.nextSibling).find('[edit]');
				if (!$nextTd.length) { return; }
			}
			this.renderOverlay($nextTd[0]);
			this.overlayElement.style.display = 'block';
			this.focusEditField();
		},

		/**
		 * Move focus to the previous editable field in the table
		 */
		prevField: function () {
			var td = this.overlayElement._lastTd;
			var $prevTd = $(td).prevAll('[edit]');
			if (!$prevTd.length) {
				var tr = td.parentNode;
				if (!tr.previousSibling) { return; }
				$prevTd = $(tr.previousSibling).find('[edit]').last();
				if (!$prevTd.length) { return; }
			}
			this.renderOverlay($prevTd[0]);
			this.overlayElement.style.display = 'block';
			this.focusEditField();
		},

		/**
		 * Update an element in the table data array based on the changed value from the field
		 * @param {any} value Changed value of the cell. Could be any type but usually a string.
		 * @param {string} rowIndex Index of the row. Could be a string in this case since we store it in the attribute.
		 * @param {string} colIndex Index of the column. Could be a string in this case since we store it in the attribute.
		 */
		updateCellData: function (value, rowIndex, colIndex) {
			this.data[Number(rowIndex)][Number(colIndex)] = value;
			var td = this.renderCell(rowIndex, colIndex, value);
			var originalTd = this.overlayElement._lastTd;
			originalTd.innerHTML = td.innerHTML;
			this.dispatchEvent(new CustomEvent('cellchange', {detail: {newValue: value, rowIndex: rowIndex, colIndex: colIndex}}));
		},

		/**
		 * React on field changes usually to update cell data.
		 * @param {HTMLElement} field Field element
		 */
		fieldChange: function (field) {
			if (field._originalValue != field.value) {
				// update the data 
				this.updateCellData(field.value, field._rowIndex, field._colIndex);
				
			}
		},

		/**
		 * Control how each cell can be displayed in edit mode.
		 * @param {any} data Cell data @see tableData
		 * @param {string} rowIndex Index of the row. Could be a string in this case since we store it in the attribute.
		 * @param {string} colIndex Index of the column. Could be a string in this case since we store it in the attribute.
		 * @param {number} tabIndex Used to support tabbing though fields. Usually it should be 2 because we place two fake fields around our primary field. When we switch focus to the next fake field it will switch to the actual next field.
		 * @return {HTMLElement} field A newly created field element
		 */
		createField: function (data, rowIndex, colIndex, tabindex) {
			var field = document.createElement('input');
			field.classList.add('zs-input');
			field.setAttribute('type', 'text');
			field.setAttribute('tabindex', tabindex);
			field.value = data;
			field._originalValue = data;
			return field;
		},

		/**
		 * Creates an editable control and extra logic to support tabbing and styling.
		 * @param {HTMLElement} overlay Overlay element to attach a field element to.
		 */
		renderField: function (overlay) {
			// Create a field. Use custom logic here to detect a field type
			var field,
				self = this,
				td = overlay._lastTd,
				colIndex = td.getAttribute('key'),
				rowIndex = td.parentNode.getAttribute('key');


			// Field element
			var data = td.querySelector('.zs-cell').innerHTML;
			field = this.createField(data, rowIndex, colIndex, 2);
			$(field).css({ width: $(td).width(), height: $(td).height()});
			overlay.appendChild(field);
			field._rowIndex = rowIndex;
			field._colIndex = colIndex;
			field.focus();
			field.addEventListener('change', function (e) {
				self.fieldChange(field);
			});
		},

		/**
		 * Adjust position of the overlay when we create it or resize the table or scroll inside the table
		 * @description We want to place our overlay over a cell we want to edit.
		 */
		positionOverlay: function () {
			var $overlay = $(this.overlayElement),
				scrollEl = this.scrollEl || this;
			if (!this.overlayElement || !($overlay.is(':visible')) || !this.overlayElement._lastTd) { return; }
			var td = this.overlayElement._lastTd;
			var p = { top: td.offsetTop - this.table.offsetTop , left: td.offsetLeft  - this.table.offsetLeft};
			$(this.overlayElement).css({ top: p.top, left: p.left, minWidth: $(td).width(), minHeight: $(td).height() });
		},

		/**
		 * Create an overlay element 
		 * @description We need a container to place our control. Controls could be more complex and bigger than our table cell.
		 * @param {HTMLElement} td Table cell element with the data we want to start editing.
		 */
		renderOverlay: function (td) {
			var self = this;

			// Create an overlay element
			if (!this.overlayElement) {
				this.considerPosition('relative');
				this.overlayElement = document.createElement('div');
				this.overlayElement.setAttribute('class', 'zs-edit-overlay');
				this.overlayElement.style.position = 'absolute';
			} else {
				this.overlayElement.innerHTML = '';
			}

			// Inset overlay in the table container
			this.appendChild(this.overlayElement);
			this.overlayElement._lastTd = td;

			// Render editable field
			this.positionOverlay();

			// Render field
			this.renderField(this.overlayElement);

			// Fake prev field to handle tabbing through fields
			$('<input tabindex="1" type="text" style="position:absolute;width:0px;height:0px">').on('focus', function () {				
				self.prevField();
			}).appendTo(this.overlayElement);

			// Fake next field to handle tabbing through fields
			$('<input tabindex="3" type="text" style="position:absolute;width:0px;height:0px">').on('focus', function () {
				self.nextField();
			}).appendTo(this.overlayElement);
		},

		/**
		 * Handle cell click inside the table
		 * @param {event} e Click event that propagated from the cell
		 * @listens click
		 */
		cellClick: function (e) {
			var td = e.target;
			// Check if we clicked inside an overlay
			if ($(td).parents('.zs-edit-overlay').length) {
				return;
			}

			// First of all we need to detect if we entering an editable cell.
			var isEditable = e.target.getAttribute('edit') != null;
			if (!isEditable) {
				if (this.overlayElement) { $(this.overlayElement).remove(); this.overlayElement = null; }
				return;
			}

			this.renderOverlay(td);
			$(this.overlayElement).show();
		},

		/**
		 * Handle window.resize event to fire resize event and adjust overlay position
		 * @fires resize
		 */
		onWindowResize: function () {
			if (this._resizeAnimationFrame) { return; }
			var self = this;
			this._resizeAnimationFrame = window.requestAnimationFrame(function () {
				self.dispatchEvent(new CustomEvent('resize'));
				self._resizeAnimationFrame = null;
			});
		},

		/**
		 * @event resize Fires when we resize table
		 */

		 /**
		 * @event cellchange Fires when we cell data is changed
		 */

		/**
		 * Event listeners
		 */
		events: {
			scroll: function () {
				if (this._scrollAnimationFrame) { return; }
				var self = this;
				this._scrollAnimationFrame = window.requestAnimationFrame(function () {
					self.positionOverlay();
					self._scrollAnimationFrame = null;
				});
			},
			attach: function () {
				this._onWindowResizeBound = this.onWindowResize.bind(this);
				$(window).resize(this._onWindowResizeBound);
			},
			detach: function () {
				$(window).off('resize', this._onWindowResizeBound);
				window.cancelAnimationFrame(this._resizeAnimationFrame);
			},
			render: function () {
				if (this.overlayElement) { $(this.overlayElement).remove(); } // remove the overlay when we refresh the table
			},
			click: function (e) {
				this.cellClick.apply(this, arguments);
			},
			resize: function () {
				this.positionOverlay();
			}
		}
	};


	return zs;
})(window.zs || {});