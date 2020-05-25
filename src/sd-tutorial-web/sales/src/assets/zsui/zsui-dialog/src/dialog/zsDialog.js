
var zs = (function (zs) {
	'use strict';
	/**
 	 * zs.dialog is a wrapper on jQuery zsModalDialog plugin. It provides options to configure the plugin and also provide callbacks and hooks for the consumer.
 	 * @namespace 
 	*/
	zs.dialog = {
		/**A boolean value that indicates whether dialog plugin is configured or not.*/
		isConfigured: false,
		/** Removes the dialog plugin */
		removePlugin: function () {
			$(this).zsModalDialog('destroy');
			this.isConfigured = false;
		},
		/** Configures the dialog plugin 
		 * @param afterConfigure {function} gets called after configuration of plugin.
		*/
		configurePlugin: function (afterConfigure) {
			var comp = this;

			var configuration = {
				autoOpen: this.getAttribute('open') != null,
				submitSelector: '>footer button[submit]',
				events: {
					open: function () {
						comp.syncAttribute(true);
					},
					close: function () {
						comp.syncAttribute(false);
					},
					submit: function (e) {
						if (typeof (comp.handleSubmitAction) === 'function') {
							comp.handleSubmitAction.call(comp);
							e.preventDefault();
						} else {
							comp.close();
						}
					}
				}
			};

			$(function () {
				$(comp).zsModalDialog(configuration);
				comp.isConfigured = true;
				if (typeof afterConfigure == 'function') {
					afterConfigure.apply(comp);
				}
				var event = new CustomEvent('configure');
				comp.dispatchEvent(event);
			});
		},
		/** Synchronizes the "open" attribute value */
		syncAttribute: function (open) {
			// Sync attribute value
			this.ignoreChange = true;
			if (open) {
				this.setAttribute('open', '');
			} else {
				this.removeAttribute('open');
			}
		},
		/** Opens a dialog */
		open: function () {
			if (!this.isConfigured) {
				this.configurePlugin(function () {
					$(this).zsModalDialog('open');
				});
			} else {
				$(this).zsModalDialog('open');
			}
		},
		/** Closes the dialog */
		close: function () {
			if (!this.isConfigured) {
				this.configurePlugin(function () {
					$(this).zsModalDialog('close');
				});
			} else {
				$(this).zsModalDialog('close');
			}
		},
		/** Provides callback handles for events such as attach, detach, create and attributeChange.
		 * create method is called when an instance of the element is created.  
		 * attach method is called when an instance was inserted into the document.
		 * detach method is called when an instance was removed from the document.	 
		 * attributeChange method is called when an attribute was added, removed, or updated.		
		*/

		events: {
			attach: function () {
				this.configurePlugin();
			},
			detach: function () {
				this.removePlugin();
			},
			create: function () {
				console.log('zs-dialog', 'created');
			},
			attributeChange: function (event) {
				if (this.ignoreChange) { this.ignoreChange = false; return; }
				var attributeName = event.detail.attributeName;
				if (attributeName == 'open') {
					this.open();
				}
			}
		}
	};

	zs.dialogElement = zs.customElement(HTMLElement, 'zs-dialog', null, [zs.dialog]);

	return zs;
})(window.zs || {});