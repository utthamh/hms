module.exports = function (grunt) {
	var src = __dirname + '/src';
	var dist = __dirname + '/dist';
	console.log('config', src, dist);
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
						cwd: 'src/themes',
						src: ['**/*.less'],
						dest: 'dist/themes/',
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
						cwd: 'src/themes',
						src: ['**/*.less'],
						dest: 'dist/themes/',
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
				tasks: ['less', 'copy', 'uglify', 'ejs'],
				options: {
					reload: true
				}
			},
			styles: {
				files: [`${src}/themes/**/**/*.less`, `${src}/**/*.less`],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			},
			scripts: {
				files: [`${src}/**/*.js`],
				tasks: ['copy', 'uglify']
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
						cwd: `${src}`,
						src: ['**/*.js', '!**/test.**.js'],
						dest: `${dist}`
					},
					{ src: ['node_modules/zsui-core/demo/partials/demo.js'], dest: 'dist/demo.js' }
				]
			},

		},
		clean: {
			all: 'dist'
		},
		ejs: {
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
			demo: {
				src: ['demo/templates/*.html'],
				dest: 'dist',
				expand: true,
				ext: '.html',
				flatten: true
			}
		},
		uglify: {
			options: {
				sourceMap: true
			},
			pagination: {
				files: [
					{
						src: 'src/pagination/jquery.zsPagination.js',
						dest: 'dist/pagination/jquery.zsPagination.min.js'
					},
					{
						src: 'src/pagination/pagination.js',
						dest: 'dist/pagination/pagination.min.js'
					}
				]
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
