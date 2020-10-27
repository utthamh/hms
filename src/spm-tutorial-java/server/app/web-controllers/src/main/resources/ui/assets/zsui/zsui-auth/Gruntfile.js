module.exports = function (grunt) {
    var nodePath = grunt.file.isPathInCwd("node_modules/") ? "node_modules" : "../../node_modules";
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
                    sourceMapFileInline: true

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
                    }
                ]
            }
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
                tasks: ['build'],
                options: {
                    nospawn: true
                }
            },
            demo: {
                files: ['demo/**/*.html'],
                tasks: ['build']
            },
            scripts: {
                files: ['src/user/*.js'],
                tasks: ['build']
            },
        },
        copy: {
            app: {
                files: [
                    { expand: true, cwd: 'src', src: ['user/*', '!**/test.**.js', '!**/**.less'], dest: 'dist' },
                    { src: ['node_modules/zsui-core/demo/partials/demo.js'], dest: 'dist/demo.js' }
                ],
            }
        },
        clean: {
            html: 'dist',
            doc: 'docs'
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
                src: ['demo/pages/*.*'],
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
                    dest: 'dist/',
                    cwd: 'src',
                    ext: '.min.js',
                    extDot: 'last'
                },
                files: [{
                    expand: true,
                    src: ['**/*.js', '!**/test.**.js'],
                    dest: 'dist/',
                    cwd: 'src',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            },
        },
        jsdoc: {
            dist: {
                src: ['src/**/*.js', 'README.md'],
                options: {
                    destination: 'docs',
                    template: "node_modules/docdash"

                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ejs');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'copy', 'less', 'uglify', 'ejs', 'jsdoc']);
};

