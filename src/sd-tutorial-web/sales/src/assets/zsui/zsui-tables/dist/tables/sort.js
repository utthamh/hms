var zs = (function (zs) {
	'use strict';

	/**
	 * @class 		ZS TableSortable
	 * @classdesc 	Adds sortable behavior to ZSTable. 
	 * @example 	Add sortable attribute to every element suppose to have sorting listener then simply listen to "sort" event of entire table. 
	 * 				Additionally you can provide sorting-event (click by default) and sorting-elm ("a" by default) as attributes of your sorting elm.
	 */
	zs.tableSortable = {
		/**
		 * Adds sorting listener to provided element
		 * 
		 * @param {Element} td - Element td that should react as a sortable elm
		 * 
		 * @returns {Element}
		 */
		addSortableListener: function (td, sortOrder, strip) {
			var comp = this,
				tagName = td.getAttribute('sorting-elm') || 'a',
				eventName = td.getAttribute('sorting-event') || 'click',
				elm = document.createElement(tagName),
				event = new CustomEvent('sort', { detail: { elm: td } });

			if (!strip) {
				// Wrap contents
				while (td.firstChild) { // move all children
					elm.appendChild(td.firstChild);
				}
			} else {
				// Strip  contents
				elm.innerHTML = td.textContent;
				td.innerHTML = '';
			}

			elm.addEventListener(eventName, function (e) {
				comp.dispatchEvent(event);
			});

			td.appendChild(elm);

			if (sortOrder) {
				elm.setAttribute('sort', sortOrder);
			} else {
				elm.removeAttribute('sort');
			}

			return td;
		}
	};
	return zs;
})(window.zs || {});
