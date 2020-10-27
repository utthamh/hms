var zs = (function (zs) {
	'use strict';

	/**
	 * Smart render table behavior. Useful to improve the table rendering performance by rendering only changed records.
	 * @namespace
	 */
	zs.tableSmartRender = {
		_data: null,
		_hash: null,
		_rowHash: null,
		_changes: null,

		/**
		 * Returns the row key based on the row index.
		 * @param {number} rowIndex Index of the row.
		 * @param {(Array|object)} rowData Data associated with the row.
		 * @returns {number} Index of the row.
		 */
		getRowKey: function (rowIndex, rowData) {
			return rowIndex;
		},

		/**
		 * Returns the hash data of the table.
		 * @param {object} data data associated with the table.
		 * @returns {string} Hash data of the table data.
		 */
		getHash: function (data) {
			return JSON.stringify(data);
		},

		/**
		 * Returns the hash data of the given row.
		 * @param {number} rowIndex Index of the row for which we need to get the hash data.
		 * @param {(Array|object)} rowData Data associated with the row.
		 * @returns {string} Hash data of the given table row.
		 */
		getRowHash: function (rowIndex, rowData) {
			return JSON.stringify(rowData);
		},

		/**
		 * Object containing the properties of the element.
		 */
		properties: {
			data: {
				set: function (newValue) {
					this.detectChangesUpdateHash(newValue);				
				},
				get: function () {
					return this._data;
				}
			}
		},

		/**
		 * Detects data changes and updates hash.
		 * @param {Array} newValue Array containing new values.
		 */
		detectChangesUpdateHash:function(newValue){
			if (this._data != null && this._rowHash) {
				this.detectChanges(newValue);
			}

			// Update hash to detect changes later
			var timer = performance.now();
			this._rowHash = {};
			this._hash = '';
			for (var i = 0; i < newValue.length; i++) {
				var rowData = newValue[i];
				var hash = this.getRowHash(i, rowData);
				this._rowHash[this.getRowKey(i, rowData)] = { hash: hash, data: rowData, index: i };
				this._hash += (this._hash == '' ? '' : ',') + hash;
			}
			this._hash = '[' + this._hash + ']';
			console.log('hashes created in', performance.now() - timer);

			this._data = newValue;
		},

		/**
		 * Check for changes
		 * @param {Array} newArray Array containing new values.
		 * @return {Object} - Object indicating changes in data like {add: [1, 2, 3], remove: [4], modify: [5]}
		 */
		detectChanges: function (newArray) {
			var timer = performance.now();
			//console.log('detect changes', newArray.slice(0));
			this._changes = {};
			var newHash = this.getHash(newArray);

			if (this._hash == newHash) {
				// Hasn't changed
				console.log('no changes');
				this._changes = false;
				return this._changes;
			}

			if ((this._data == null || this._data.length == 0) && newArray && newArray.length) {
				// We had empty data and got something 
				console.log('new data');
				this._changes = -1;
				return this._changes;
			}

			// Detect new and modified items
			var newRowHash = {};
			for (var i = 0; i < newArray.length; i++) {
				var rowData = newArray[i];
				var key = this.getRowKey(i, rowData);
				var hash = this.getRowHash(i, rowData);
				newRowHash[key] = { hash: hash, data: rowData, index: i };
				if (!this._rowHash[key]) { // new item
					if (!this._changes.add) { this._changes.add = []; }
					this._changes.add.push({ key: key, index: i, data: rowData });
					continue;
				}

				if (this._rowHash[key].hash != hash) { // modified
					if (!this._changes.modify) { this._changes.modify = []; }
					this._changes.modify.push({ key: key, index: i, data: rowData });
				}

				if (this._rowHash[key].index != i) { // new order
					if (!this._changes.move) { this._changes.move = []; }
					this._changes.move.push({ key: key, index: i, data: rowData });
				}
			}

			// Detect deleted items
			for (var i in this._rowHash) {
				if (!newRowHash[i]) {
					if (!this._changes.remove) { this._changes.remove = []; }
					this._changes.remove.push({ key: i, index: this._rowHash[i].index, data: this._rowHash[i].data });
				}
			}

			console.log('changes detected', this._changes, 'in ' + (performance.now() - timer));

			return this._changes;
		},

		/**
		 * Renders the changed records.
		 */
		renderChanges: function () {
			var i, data, key, rowData, tr, originalTr,
				tableContainer = this.tableContainer || this,
				comp = this;

			if (!this._changes) { return; }
			if (this._changes == -1) { this.renderTable(this.data); return; }
			if (this._changes.move) { this.renderTable(this.data); return; } // when sort order is change it would be too expansive to update that.

			// Remove items
			if (this._changes.remove) {
				data = this._changes.remove;
				for (i = 0; i < data.length; i++) {
					rowData = data[i].data;
					key = data[i].key;
					tr = this.tbody.querySelector('tr[key="' + key + '"]');
					if (tr) {
						tr.parentNode.removeChild(tr);
					}
				}
			}

			// Modify items
			if (this._changes.modify) {
				data = this._changes.modify;
				for (i = 0; i < data.length; i++) {
					rowData = data[i].data;
					key = data[i].key;
					tr = this.renderRow(key, rowData);
					originalTr = this.tbody.querySelector('tr[key="' + key + '"]');
					if (originalTr) {
						originalTr.parentNode.replaceChild(tr, originalTr);
					}
				}
			}

			// Add items 
			if (this._changes.add) {
				data = this._changes.add;
				for (i = 0; i < data.length; i++) {
					rowData = data[i].data;
					key = data[i].key;
					tr = this.renderRow(key, rowData);
					this.tbody.appendChild(tr);
				}
			}

			// this.whenRendered().then(function () {
			this.dispatchEvent(new CustomEvent('render'));
			// });
		}

	}

	return zs;
})(window.zs || {});
