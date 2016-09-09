/// <reference path="src/external/jquery/dist/jquery.js" />
/// <reference path="src/external/jquery/dist/jquery.js" />
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        buildPath: 'public',
        pkg: grunt.file.readJSON('package.json'),

         ts: {
            default: {
                src: ["typings/**/*.ts", "src/script/**/*.ts", "!node_modules/**"],
                dest: "src/script/script.js"
            }
        },

        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'src/style/style.css': 'src/style/scss/style.scss'
                }
            }
        },

        watch: {
            sass: {
                files: ['**/*.scss', '**/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                },
            },
            ts: {
                files: ['src/script/**/*.ts'],
                tasks: ['ts'],
                options: {
                    spawn: false,
                },
            },
            handlebars: {
                files: ['**/*.hbs'],
                tasks: ['handlebars'],
                options: {
                    spawn: false,
                },
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: function (filename) {
                        var names = filename.split('/')//filename.replace(/src\/script\/templates\/(.*)\/(.*)\.hbs/, '$1');
                        names = names.slice(2, names.length - 1)
                        return "app." + names.join('.');
                    },
                    processName: function (filename) { // input: templates/_header.hbs
                        //return filename.replace(/src\/script\/templates\/(.*)\.hbs/, '$1')
                        var pieces = filename.split('/');
                        var name = pieces[pieces.length - 1];
                        return name.replace('.hbs', '');
                    }
                },
                files: {
                    'src/script/template.js': ['src/script/**/*.hbs']
                }
            }
        },
        inline: {
            dist: {
                options: {
                    inlineTagAttributes: {
                        js: 'data-inlined="true"',
                        css: 'data-inlined="true"'
                    },
                    uglify: true,
                    cssmin: true,
                },
                src: "src/index.html",
                dest: "src/PokeEase.html"
            }
        },

        copy: {
            html: {
                files: [{
                    //cwd: "src/",
                    expand: true,
                    flatten: true,
                    src: ['src/*.html'],
                    dest: 'public',
                    filter: 'isFile'
                },
                ]
            },
            images: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: "src/images/",
                        src: ['**'],
                        dest: '<%= buildPath %>/images/',
                        filter: 'isFile'
                    },

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['path/**'], dest: 'dest/'},

                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

                    // flattens results to a single level
                    { expand: true, flatten: true, src: ['src/external/ion.rangeSlider/img/*'], dest: '<%= buildPath %>/images/', filter: 'isFile' },
                ],
            }
        },
        concat: {
            generated: {
                files: [
                {
                    dest: '.tmp/script/app.js',
                    src: ['src/script/*.js']
                },
                {
                    dest: '.tmp/script/vendor.js',
                    src: [
                          'src/external/jquery/dist/jquery.js',
                          'src/external/lodash.js',
                          'src/external/localStoragePolyfill.js',
                          'src/external/leaflet/dist/leaflet-src.js',
                          'src/external/google-map-infobubble/src/infobubble.js',
                          'src/external/jquery-animateNumber/jquery.animateNumber.js',
                          'src/external/qtip2/dist/jquery.qtip.js',
                          'src/external/moment/moment.js',
                          'src/external/jquery-circle-progress/dist/circle-progress.js',
                          'src/external/jquery.easing/js/jquery.easing.js',
                          'src/external/handlebars/handlebars.js',
                          'src/external/ion.rangeSlider/js/ion.rangeSlider.js',
                          'src/external/jquery.easing.compatibility.js',
                    ]
                },
                {
                    dest: '.tmp/css/site.css',
                    src: ['src/style/*.css']
                },
                {
                    dest: '.tmp/css/vendor.css',
                    src: ['src/external/**/*.css','src/external/*/*.css']
                }
                ]
            }
        },

        uglify: {
            generated: {
                files: [{
                    dest: 'public/script/app.js',
                    src: ['.tmp/script/app.js']
                },
                {
                    dest: 'public/script/vendor.js',
                    src: ['.tmp/script/vendor.js']
                }]
            }
        },

        cssmin: {
            generated: {
                files: [{
                    dest: 'public/styles/site.min.css',
                    src: ['.tmp/css/site.css']
                },
                {
                    dest: 'public/styles/vendor.min.css',
                    src: ['.tmp/css/vendor.css']
                }]
            }
        },
        useminPrepare: {
            html: 'public/index.html',
            options: {
                dest: 'dist'
            }
        },
        bower_main: {
            copy: {
                options: {
                    dest: 'src/external'
                }
            }
        },
        typings: {
            install: {

            }
        },
        usemin: {
            html: 'public/index.html',
        }
    });
   
    grunt.registerTask('build', [
        'typings',
        'ts',
        'sass',
        'handlebars',
        'bower_main',
        'copy:html',
        'copy:images',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
       // 'filerev',
        'usemin'
    ]);
    grunt.registerTask('default', ['bower_main', 'ts', 'sass', 'handlebars', 'watch']);
};
