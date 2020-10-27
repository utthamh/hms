var zs = (function (zs) {
	'use strict';

	// Helpers used only for demo purposes
	zs.demo = {
		env: null, // nodejs, npm, nuget
		urlReplacements: {},
		theme: 'zs',

		// Get parameters from the query string
		getParameterByName: function (name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		},

		addUrlFixes: function (fixes) {
			var fixesForEnv = fixes[this.env];
			$.extend(this.urlReplacements, fixesForEnv);
		},
		setPaths: function () {
			this.theme = this.getParameterByName('theme') || 'zs';
			this.urlReplacements['\{theme\}'] = this.theme;

			// Detect environment
			var path = window.location.pathname;
			if (path.indexOf('/node_modules/') >= 0) {
				this.env = 'npm'; // Module installed as npm dependency
			} else {
				var paths = path.split('/');
				if (paths.length > 1) {
					var folder = paths[paths.length - 2];
					if (folder == 'zsui') {
						this.env = 'nuget'; // Modules installed as a nuget dependency
					} else {
						this.env = 'nodejs'; // We are working on this module in nodejs environment
					}
				}
			}

			if (!this.env) { // Manual settings
				console.warn('Can\'t detect environment of this example. Links to external dependencies might be broken.');
			}
		},
		formatURL: function (url) {
			//console.log(url, urlReplacements);
			var result = url;
			for (var i in this.urlReplacements) {
				result = result.replace(new RegExp(i, 'ig'), this.urlReplacements[i]);
			}
			return result;
		},
		link: function (src) {
			src = this.formatURL(src).replace(/\/\//g, "/");

			var link = document.createElement('link');
			link.setAttribute('rel', "stylesheet");
			link.setAttribute('href', src);
			document.head.appendChild(link);

		},
		script: function (src) {
			src = this.formatURL(src).replace(/\/\//g, "/");
			document.writeln('<script src="' + src + '"><\/script>');
		},
		// Add theme name to the links
		applyTheme: function () {
			var self = this;
			$('.themes a').each(function () {
				var $a = $(this);
				var href = $a.attr('href');
				var file = href.split('?')[0];
				$a.attr('href', file + '?theme=' + self.theme);
			});
		},
		adjustCss: function () {
			var styles = document.body.querySelectorAll('style');
			for (var i = 0; i < styles.length; i++) {
				var style = styles[i].cloneNode(styles[i]);
				document.head.appendChild(style);
			}
		},
		escapeRegExp: function (str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},
		replaceAll: function (string, search, replacement) {
			var newString = string;
			if (!$.isArray(search)) {
				search = [search];
			}
			if (!$.isArray(replacement)) {
				replacement = [replacement];
			}

			for (var i = 0; i < search.length; i++) {
				newString = newString.replace(search[i], replacement[i]);
			}

			return newString;
		},
		highlight: function () {
			if (!hljs) {console.warn('Highlight JS library is missing');return;}		
			$('code[for]').each(function () {
				// Get source code
				var sourceId = $(this).attr('for');
				var $source = $('#' + sourceId);
				if (!$source.length) { return; }
				var html = $source.html();
				// Fix links
				html = zs.demo.replaceAll(html, ['<!---','//-->', '//--&gt;'], ['','','']);
				console.log(html);		
				/* var results = hljs.highlight('html', html);
				if (results.value) {
					var code = results.value;
					this.innerHTML = '<pre>' + code + '</pre>';
				}*/

				this.innerHTML = '<pre></pre>';
				var preTag =this.querySelector('pre');
				preTag.textContent = html;
				hljs.highlightBlock(this);
			});
		}
	}
	return zs;
})(window.zs || {});