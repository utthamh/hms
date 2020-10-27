module.exports = function (grunt) {

	grunt.initConfig({
		watch: {
			configFiles: {
				files: ['Gruntfile.js', '.babelrc'],
				tasks: ['build'],
				options: {
					reload: true
				}
			},
			demo: {
				files: ['demo/**/*.*'],
				tasks: ['ejs']
			},
			scripts: {
				files: ['src/**/*.js'],
				tasks: ['copy', 'babel', 'uglify', 'jsdoc_to_md', 'md_to_wiki']
			},
			docs: {
				files: ['docs/*.md'],
				tasks: ['md_to_wiki']
			}			
		},
		copy: {
			app: {
				files: [
					{ expand: true, cwd: 'src', src: ['app/*', '!**/test.*.js'], dest: 'dist' },
				]
			},
			urlPolyfill: {
				
				files: [
					{src: ['node_modules/url-polyfill/url-polyfill.min.js'], dest: 'dist/state/url-polyfill.min.js'}
				]
			},
			fetchPolyfill: {
				files: [
					{src: ['node_modules/whatwg-fetch/dist/fetch.umd.js'], dest: 'dist/service/fetch.js'}
				]
			}
		},
		clean: {
			html: 'dist',
			mdDocs: 'docs/src'
		},
		ejs: {
			demo: {
				src: ['demo/*.html'],
				dest: 'dist',
				expand: true,
				ext: '.html',
				sourceMap: true,
				flatten: true
			}

		},
		uglify: {
			scripts: {                
				options: {
					sourceMap: true,
				},
                files: [{
					expand: true,
					cwd: 'dist/',
					src: ['**/*.js', '!**/*.min.js'],
					dest: 'dist/',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
		},	
		jsdoc_to_md: {
			default: {
				files: [{
					"expand": true,
					"cwd": "src",
					"src": ["**/*.js", "**/*.m.js", "!**/test.**.js", "!**/test**.js"]
				}],
				options: {
					destination: "docs"
				}
			}
		},
		md_to_wiki: {
			default: {
				files: [{
					"expand": true,
					"cwd": "docs",
					"src": ["src/**/*.md"]
				}],
				options: {
					templateSource: "docs",
					title: "API Doc for Core Module",
					indexFileName: "index.md",
					generateIndex: false
				}
			}
		},
		babel: {
			es5: {
				
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.m.js', '**/*.mjs'],
					ext: '.js',
					extDot: 'last',
					dest: 'dist/',
					rename: function (dest, src) {
						return dest + src.replace('.m.js', '.js').replace('.mjs', '.js');
					}
				}],
				options: {
					sourceMap: false,
					presets: ['@babel/preset-env'],
					plugins: ['@babel/plugin-transform-classes'],
				
				}
			}
		}

	});
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ejs');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['clean', 'copy', 'babel','uglify', 'ejs', 'docs']);

	grunt.registerTask('docs', ['jsdoc_to_md', 'md_to_wiki', 'clean:mdDocs']);


	grunt.registerMultiTask('jsdoc_to_md', function () {
		var documentation = require('documentation');

		var path = require('path');

		var done = this.async();

		var options = this.options();

		var inputs = this.files.map(function (file) {
			return file.src[0];
		});

		var counter = inputs.length;

		inputs.forEach(function (fileName) {
			documentation.build([fileName], options)
				.then(documentation.formats.md)
				.then(function (output) {
					// output is a string of Markdown data
					var dest = path.join(
						process.cwd(),
						options.destination,
						fileName + ".md"
					).replace(".m.", ".").replace(".js", "");

					grunt.file.write(dest, output);
					console.log("Wrote Markdown to: ", dest);

					if (--counter == 0) {
						done(true);
					}

				}).catch(function (err) {
					grunt.log.error(err.toString());
					if (err.codeFrame) {
						grunt.log.error(err.codeFrame);
					}
					done(err);
				});
		});

	});

	grunt.registerMultiTask('md_to_wiki', function () {
		var mdast = require('remark');

		var inject = require('mdast-util-inject');

		var fs = require('fs');

		var path = require('path');

		var options = this.options();

		var destPath = path.join(process.cwd(), options.templateSource);

		var inputFiles = this.files.map(function (file) {
			return file.src[0];
		});

		var toc = (options.title || "") + "\n===\n";

		inputFiles.forEach(function (fileName) {

			var mdFileContent = fs.readFileSync(fileName, 'utf8');
			var targetFilePath = path.join(destPath, fileName.slice(fileName.lastIndexOf("/") + 1));

			if (fs.existsSync(targetFilePath)) {
				console.log(targetFilePath);

				toc += "[" + fileName.slice(fileName.lastIndexOf("/") + 1) + "](" + fileName.slice(fileName.lastIndexOf("/") + 1) + ")\n";

				var targetParsedContents = mdast.parse(fs.readFileSync(targetFilePath, 'utf-8'));
				var sourceParsedContents = mdast.parse(mdFileContent);

				if (inject('API', targetParsedContents, sourceParsedContents)) {
					fs.writeFileSync(targetFilePath, mdast.stringify(targetParsedContents));
					console.log("Inserted API doc to file: ", targetFilePath);
				}
			}

		});

		toc += "- - -";

		if (options.generateIndex == true) {
			grunt.file.write(path.join(destPath,
				options.indexFileName
			), toc);

			console.log("Wrote Index file: ", options.indexFileName);
		}
	});
};
