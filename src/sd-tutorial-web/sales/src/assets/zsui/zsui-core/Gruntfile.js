module.exports = function (grunt) {
	var src = __dirname + '/src';
	var dist = __dirname + '/dist';

	grunt.initConfig({
		less: {
			minifyLess: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2,
					strictMath: false,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapBasepath: function () {
						this.sourceMapURL = this.sourceMapFilename.substr(this.sourceMapFilename.lastIndexOf('/') + 1);
					}
				},
				files: [
					{
						expand: true,
						cwd: 'src/themes',
						src: ['**/*.less', '!**/custom.less'],
						dest: 'dist/themes/',
						ext: '.min.css',
						extDot: 'last',
						rename: function (dest, src) {
							return dest + src.replace('package.', '');
						}
					}
				]
			},
			compileLess: {
				options: {
					compress: false,
					yuicompress: true,
					optimization: 2,
					strictMath: false,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapBasepath: function () {
						this.sourceMapURL = this.sourceMapFilename.substr(this.sourceMapFilename.lastIndexOf('/') + 1);
					}
				},
				files: [
					{
						expand: true,
						cwd: 'src/themes',
						src: ['**/*.less', '!**/custom.less'],
						dest: 'dist/themes/',
						ext: '.css',
						extDot: 'last',
						rename: function (dest, src) {
							return dest + src.replace('package.', '');
						}
					},
					{
						src: 'test/test.less',
						dest: 'test/test.css'
					}
				]
			},
		},
		watch: {
			configFiles: {
				files: ['Gruntfile.js'],
				tasks: ['build'],
				options: {
					reload: true
				}
			},
			styles: {
				files: ['src/themes/**/*.less', 'src/**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			},
			testLess: {
				files: ['test/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			},
			scripts: {
				files: ['src/**/*.js', 'eslint.json'],
				tasks: ['build', 'jsdoc_to_wiki']
			},
			html: {
				files: ['demo/*.*', 'demo/**/*.*'],
				tasks: ['ejs', 'babel:demo']
			}
		},
		copy: {
			assets: {
				files: [
					{ expand: true, cwd: 'src', src: ['fonts/*', 'images/*', 'utils/*', '!utils/testUtils.js'], dest: 'dist' },
					{ src: ['demo/partials/demo.js'], dest: 'dist/demo.js' }
				]
			},
			components: {
				expand: true,
				cwd: src,
				src: ['**/*.js', '!**/test.**.js'],
				dest: `${dist}`
			},
			modules: {
				expand: true,
				cwd: 'dist/mjs',
				src: ['**/*.js', '!**/test.**.js'],
				dest: `${dist}`
			},
			polyfills: {
				files: [
					{ src: 'node_modules/custom-event-polyfill/polyfill.js', dest: 'src/polyfills/customEvent.min.js' },
					{ src: 'node_modules/custom-event-polyfill/polyfill.js', dest: 'dist/polyfills/customEvent.min.js' },
					{ src: 'node_modules/document-register-element/build/document-register-element.js', dest: 'src/polyfills/customElements.min.js' },
					{ src: 'node_modules/document-register-element/build/document-register-element.js', dest: 'dist/polyfills/customElements.min.js' },
					// We are using a patched polyfill for now
					//{src: 'node_modules/@ungap/custom-elements-builtin/min.js', dest: 'src/polyfills/builtInElement.min.js'},
					//{src: 'node_modules/@ungap/custom-elements-builtin/min.js', dest: 'dist/polyfills/builtInElement.min.js'},
					{ src: 'node_modules/es6-object-assign/dist/object-assign-auto.min.js', dest: 'src/polyfills/objectAssign.min.js' },
					{ src: 'node_modules/es6-object-assign/dist/object-assign-auto.min.js', dest: 'dist/polyfills/objectAssign.min.js' },
					{ src: 'node_modules/promise-polyfill/dist/polyfill.min.js', dest: 'src/polyfills/promise.min.js' },
					{ src: 'node_modules/promise-polyfill/dist/polyfill.min.js', dest: 'dist/polyfills/promise.min.js' }
				]
			}
		},
		clean: {
			nuget: ["nuget/content/zsui/"],
			html: 'dist',
			mdDocs: 'docs/src',
			modules: 'dist/mjs',
			prepareDist: ['dist/index.html', 'dist/demo.js'] // This task is used on TeamCity build to cleanup unnecessary files before deployment to S3.
		},
		ejs: {
			options: {
				urlFixes: {
					// RegExp
					nodejs: { // Default has no replacements needed.								
					},
					npm: { // When we consume this library module as npm package
						'\.\.\/node\_modules\/': '../../'
					},
					nuget: { // When we consume this library module as nuget package
						'\.\.\/node\_modules\/zsui\-[\\w]+\/dist': './' // in nuget environment everything is in the same folder "zsui"
					},
					s3: {
						'\.\.\/node\_modules\/zsui\-[\\w]+\/dist/': './'
					}
				},
				zsuiPath: '.',
				nodeModules: '../node_modules',
				/*
				// Override ejs script from config
				script: function(src) {
					return '<script>zs.demo.script("'+src+'");</script>';
				}*/
			},
			demo: {
				src: ['demo/*.html', '!*.ejs.html', '!*.ejs'],
				dest: 'dist',
				expand: true,
				ext: '.html',
				flatten: true
			}

		},
		uglify: {
			scripts: {
				options: {
					sourceMap: true,
					output: {
						// preserves comments that start with a bang (!), or have @license, @preserve, @cc_on directives
						comments: /(?:^!|@(?:license|License|preserve|cc_on))/
					}
				},
				files: [{
					expand: true,
					src: ['**/*.js', '!**/*.m.js', '!**/test.**.js', "!**/*.min.js"],
					dest: 'dist/',
					cwd: 'src',
					ext: '.min.js',
					extDot: 'last'
				}]
			},
			modules: {
				options: {
					sourceMap: true,
					output: {
						// preserves comments that start with a bang (!), or have @license, @preserve, @cc_on directives
						comments: /(?:^!|@(?:license|License|preserve|cc_on))/
					}
				},
				files: [{
					expand: true,
					src: ['**/*.js'],
					cwd: 'dist/mjs',
					dest: 'dist/',
					ext: '.min.js',
					extDot: 'last'
				}]
			}

		},
		jsdoc: {
			dist: {
				src: ['src/**/*.js', 'README.md', 'src/less/theme.less'],
				options: {
					destination: 'docs',
					template: "node_modules/docdash"

				}
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
			mjs: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.m.js'],
					ext: '.js',
					extDot: 'last',
					dest: 'dist/mjs/',
					rename: function (dest, src) {
						return dest + src.replace('.m.', '.');
					}
				}],
				options: {
					sourceMap: true,
					presets: ['@babel/preset-env']
				}
			},			
			polyfill: {
				files: [{
					src: ['node_modules/custom-event-polyfill/polyfill.js'],
					dest: 'test/customEvent.umd.js'
				}],

				options: {
					sourceMap: true,
					presets: ['@babel/preset-env']
				}
			},

			
			demo: {
				files: [{
					expand: true,
					cwd: 'demo',
					src: ['*.m.js'],
					ext: '.js',
					extDot: 'last',
					dest: 'dist/',
					rename: function (dest, src) {
						return dest + src.replace('.m.', '.');
					}
				}],
				options: {
					sourceMap: true,
					presets: ['@babel/preset-env']
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-less');


	grunt.loadNpmTasks('grunt-contrib-watch');


	//grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.loadNpmTasks('grunt-eslint');
	//grunt.loadNpmTasks('grunt-lesslint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-ejs');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('nuget', ['clean:nuget', 'copy:nuget']);
	grunt.registerTask('npm', ['clean:npm', 'copy:npm']);
	grunt.registerTask('build', ['clean', 'babel', 'uglify', 'copy', 'clean:modules', 'less', 'ejs', 'jsdoc_to_wiki']);

	grunt.registerTask('jsdoc_to_wiki', ['jsdoc_to_md', 'md_to_wiki', 'clean:mdDocs']);

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
