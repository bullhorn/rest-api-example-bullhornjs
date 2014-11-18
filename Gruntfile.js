module.exports = function(grunt) {
    require('grunt-task-loader')(grunt);

    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            name: 'Bullhorn Roulette',
            banner: '/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>\n* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */'
        },
        // Cleans Build Directory
        clean: {
            dist: ['build/*']
        },
        // Linting Options
        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js'],
            options: {
                asi: true,
                expr: true,
                sub: true,
                loopfunc: true
            }
        },
        //Convert html templates into JS tpls
        html2js: {
            dist: {
                options: {
                    module: 'com.bullhorn.roulette.tpls'
                },
                src: ['resources/partials/**/*.html'],
                dest: '<%= dir %>/app.tpls.js'
            },
        },
        // Concatinates all javascript files
        concat: {
            dist: {
                options: {
                    banner: '<%= copyright %><%= meta.tplmodules %>\n'
                },
                src: ['src/**/*.js', '<%= dir %>/app.tpls.js'],
                dest: '<%= dir %>/app.js'
            }
        },
        // Compiles all of our LESS files
        less: {
            options: {
                paths: ["resources/less"],
                cleancss: true,
                iecompat: false
            },
            dist: {
                files: {
                    '<%= dir %>/css/core.css': 'resources/less/core.less'
                }
            }
        },
        uglify: {
            src: {
                files: {
                    '<%= dir %>/app.min.js': ['<%= dir %>/app.js']
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['resources/index.html'],
                    dest: '<%= dir %>/'
                }]
            }
        },
        bower: {
            dist: {
                dest: '<%= dir %>/',
                js_dest: '<%= dir %>/lib',
                css_dest: '<%= dir %>/css',
                options: {
                    stripAffix: true,
                    keepExpandedHierarchy: false
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: './build/debug/'
                }
            }
        }
    });

    grunt.registerTask("default", ['setup', 'clean', 'jshint', 'bower', 'copy', 'less', 'html2js', 'concat', 'uglify']);

    grunt.registerTask("setup", "Sets up build based on command line options", function() {
        if (grunt.option('production')) {
            grunt.config.set('dir', 'build/release');
        } else {
            grunt.config.set('dir', 'build/debug');
        }
    });

};
