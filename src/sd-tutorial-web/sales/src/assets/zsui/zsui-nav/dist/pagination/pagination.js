// Requires jQuery, jQuery.zsPagination
var zs = (function(zs) {
	'use strict';
	
	/**
	 * Pagination behavior is a wrapper on jQuery Pagination plugin. It provides options to configure the plugin as well as provides
	 * callbacks and hooks for the consumer.
	 * @namespace
	 */
	zs.pagination = {
		
		/**
		 * Provides the callback hooks for events when the pagination element is created, attached to DOM,
		 * attributes changed (added, removed or value changed) and removed from the DOM.
		 */
		events: {
			create: function() {
				//console.log('zs-pagination' , 'created');
			},
			attach: function() {
				this.classList.add('zs-pagination');
				this.configure();				
			},
			attributeChange: function(e) {
				if (e.detail) {
					var attributeName = e.detail.attributeName;
					if (attributeName == 'size' || attributeName == 'total' || attributeName == 'page') {
						this.configure();
					}
				}
			},
			detach: function() {
				$(this).zsPagination('destroy');
			}			
		},
		
		/**
		 * Array of attributes to observe the changes. attributeChange event is triggered when the value of any attribute from this array is changed (added, removed or modified).
		 */
		observedAttributes: ['size', 'total', 'page'],
		
		/**
		 * A callback function when user navigates from one page to another.
		 * @param oldPage {Number} Old page number
		 * @param newPage {Number} New page number
		 */
		changePage: function(oldPage, newPage) {
			this.yielding = true; // Block attribute change handler
			this.setAttribute('page', newPage);
			this.yielding = false;
			
			// Trigger event
			var event = new CustomEvent('pagechange', {detail: {currentPage: newPage}});
			this.dispatchEvent(event);
		},
		
		/**
		 * Configures the pagination plugin with provided options for items count, page size and current page.
		 */
		configure: function(newValue, oldValue) {			
			var comp = this;
			
			// Yield to let all attribute change trigger
			if (comp.yielding) {
				// console.log('zs-pagination', 'yielding');
				return;
			}			
			setTimeout(function() {			
				comp.yielding = false;
				//console.log('zs-pagination', 'configuring');
				
				var total = Number(comp.getAttribute('total')) || 0;
				var size = Number(comp.getAttribute('size')) || 0;
				var page = Number(comp.getAttribute('page')) || 0;
				
				$(comp).zsPagination({
					itemsCount: total,
					pageSize: size,
					currentPage: page,
					onPageChange: comp.changePage.bind(comp)
				});
			},0);
			comp.yielding = true;
		}
		
	}
	
	zs.paginationElement =  zs.customElement(HTMLElement, 'zs-pagination', null, [zs.pagination]);
	return zs;
})(window.zs || {});	
