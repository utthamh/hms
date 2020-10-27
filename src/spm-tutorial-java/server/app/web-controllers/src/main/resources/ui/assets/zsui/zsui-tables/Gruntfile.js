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
					sourceMapFileInline: true
				},
				files: [
					{
						expand: true,
						cwd: `${src}/themes`,
						src: ['**/*.less'],
						dest: `${dist}/themes/`,
						ext: '.min.css',
						extDot: 'last',
						rename: function (dest, src) {
							return dest + src.replace('package.', '')
						}
					}
				]
			},
			compileLess: {
				options: {
					outputSourceFiles: true,
					sourceMap: true,
					sourceMapFileInline: true
				},
				files: [
					{
						expand: true,
						cwd: `${src}/themes`,
						src: ['**/*.less'],
						dest: `${dist}/themes/`,
						ext: '.css',
						extDot: 'last',
						rename: function (dest, src) {
							return dest + src.replace('package.', '')
						}
					}
				]
			}
		},
		watch: {
			configFiles: {
				files: ['Gruntfile.js'],
				tasks: ['less', 'copy:script', 'uglify', 'ejs'],
				options: {
					reload: true
				}
			},
			styles: {
				files: [`${src}/**/*.less`],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			},
			scripts: {
				files: [`${src}/**/*.js`],
				tasks: ['copy:script', 'uglify']
			},
			html: {
				files: ['demo/examples/**/*.html', 'demo/templates/**/*.html', 'demo/partials/**/*.html'],
				tasks: ['ejs']
			}
		},
		copy: {
			js: {
				files: [
					{
						expand: true,
						cwd: src,
						src: '**/*.js',
						dest: `${dist}/`
					},
					{ src: ['node_modules/zsui-core/demo/partials/demo.js'], dest: 'dist/demo.js' }
				]
			}
		},
		uglify: {
			script: {
				options: {
					sourceMap: true
				},
				files: [{
					expand: true,
					src: ['**/*.js', '!**/test.*.js'],
					dest: 'dist/',
					cwd: 'src',
					rename: function (dest, src) { return dest + '/' + src.replace('.js', '.min.js'); }
				}]
			}
		},
		ejs: {
			demo: {
				options: {
					//corePath: '../../node_modules/zsui-core'
					urlFixes: {
						// RegExp
						nodejs: { // Default has no replacements needed.								
						},
						npm: { // When we consume this library module as npm package
							'\.\.\/node\_modules\/': '../../'
						},
						nuget: { // When we consume this library module as nuget package
							'\.\.\/node\_modules\/zsui\-[\\w]+\/dist': './' // in nuget environment everything is in the same folder "zsui"
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
				src: ['demo/templates/*.html'],
				dest: `${dist}/`,
				expand: true,
				ext: '.html',
				flatten: true
			}
		},
		jsdoc: {
			dist: {
				src: [`${src}/**/*.js`, 'README.md'],
				options: {
					destination: 'docs',
					template: "node_modules/docdash"
				}
			}
		},
		clean: {
			dist: [`${dist}`],
			doc: ['docs/']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ejs');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['clean', 'less', 'copy', 'uglify', 'ejs', 'jsdoc']);
};
