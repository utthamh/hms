module.exports = function (grunt) {
    var nodePath = grunt.file.isPathInCwd("node_modules/") ? "node_modules" : "../../node_modules";
    var altNodePath = "../../node_modules";

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
                    },
                    javascriptEnabled: true
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
                    compress: false,
                    yuicompress: true,
                    optimization: 2,
                    strictMath: false,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapBasepath: function () {
                        this.sourceMapURL = this.sourceMapFilename.substr(this.sourceMapFilename.lastIndexOf('/') + 1);
                    },
                    javascriptEnabled: true
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
                tasks: ['copy:script', 'uglify', 'jsdoc']
            },
            html: {
                files: ['demo/examples/**/*.html', 'demo/templates/**/*.html', 'demo/partials/**/*.html'],
                tasks: ['ejs']
            }
        },
        copy: {
            script: {
                expand: true,
                cwd: src,
                src: '**/*.js',
                dest: `${dist}`,
            },
            demo: { src: ['node_modules/zsui-core/demo/partials/demo.js'], dest: 'dist/demo.js' }
        },
        uglify: {
            script: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    src: ['**/*.js', '!**/test.**.js'],
                    dest: 'dist/',
                    cwd: 'src',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
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
                        '\.\.\/node\_modules\/zsui\-[\\w]+\/dist': './'
                    },
                    s3: {
                        '\.\.\/node\_modules\/zsui\-[\\w]+\/dist/': './'
                    }
                },
                zsuiPath: '.',
                nodeModules: '../node_modules',
            },
            demo: {
                src: ['demo/templates/*.html'],
                dest: 'dist/',
                expand: true,
                ext: '.html',

                flatten: true,
            }
        },
        jsdoc: {
            dist: {
                src: ['src/**/*.js', 'README.md'],
                options: {
                    destination: 'docs',
                    template: "node_modules/docdash"
                }
            }
        },
        clean: {
            dist: 'dist',
            prepareDist: ['dist/index.html', 'dist/demo.js'] // This task is used on TeamCity build to cleanup unnecessary files before deployment to S3.
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
    grunt.registerTask('build', ['clean', 'less', 'copy', 'ejs', 'uglify', 'jsdoc']);
};

