// Generated on 2014-01-02 using generator-jade 0.5.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // configurable paths
  var folders = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp'
  };

  grunt.initConfig({
    folders: folders,
    watch: {
      stylus: {
        files: '<%= folders.app %>/styles/**/*.styl',
        tasks: ['stylus']
      },
      server: {
        options: {
          livereload: true
        },
        files: [
          '<%= folders.tmp %>/*.html',
          '<%= folders.tmp %>/styles/{,*/}*.css',
          '{.tmp,<%= folders.app %>}/scripts/{,*/}*.js',
          '<%= folders.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      jade: {
        files: '<%= folders.app %>/jade/**/*.jade',
        tasks: ['jade']
      }
    },
    php: {
      server: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          base: [
            '<%= folders.tmp %>',
            '<%= folders.app %>'
          ],
          livereload: true
        }
      },
      dist: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          base: '<%= folders.dist %>',
          keepalive: true,
          livereload: false
        }
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0',
        livereload: true
      },
      server: {
        options: {
          open: true,
          base: [
            '<%= folders.tmp %>',
            '<%= folders.app %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            '<%= folders.tmp %>',
            'test',
            '<%= folders.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: [
            '<%= folders.dist %>'
          ],
          livereload: false
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= folders.tmp %>',
            '<%= folders.dist %>/*',
            '!<%= folders.dist %>/.git*'
          ]
        }]
      },
      server: '<%= folders.tmp %>'
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    stylus: {
      compile: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/styles',
          src: ['{,*/}*.styl', '!**/_*'],
          dest: '<%= folders.tmp %>/styles',
          ext: '.css'
        }],
        options: {
          compress: false,
          // convert the css url() declaration into nib inline imaging function
          // this converts images smaller than 30kb to data url
          urlfunc: 'url'
        }
      }
    },
    jade: {
      html: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/jade',
          src: ['{,*/}*.jade', '!**/_*'],
          dest: '.tmp/',
          ext: '.html'
        }],
        options: {
          client: false,
          pretty: true,
          basedir: '<%= folders.app %>/jade',
          data: function(dest, src) {

            var page = src[0].replace(/app\/jade\/(.*)\/index.jade/, '$1');

            if (page == src[0]) {
              page = 'index';
            }

            return {
              page: page
            };
          }
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= folders.dist %>/scripts/{,*/}*.js',
            '<%= folders.dist %>/styles/{,*/}*.css',
            '<%= folders.dist %>/images/{,*/}!(kim2).{png,jpg,jpeg,gif,webp}',
            '<%= folders.dist %>/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= folders.tmp %>/donate.html',
      options: {
        dest: '<%= folders.dist %>'
      }
    },
    usemin: {
      html: ['<%= folders.dist %>/{,*/}*.html'],
      css: ['<%= folders.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= folders.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= folders.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= folders.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= folders.dist %>/styles/main.css': [
            '<%= folders.tmp %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/folders/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= folders.tmp %>',
          src: '{,*/}*.html',
          dest: '<%= folders.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= folders.app %>',
          dest: '<%= folders.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}',
            'styles/fonts/*',
            'secure/**/*'
          ]
        }]
      },
      js: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>',
          dest: '<%= folders.tmp %>',
          src: [
            'scripts/{,*/}*js', 'bower_components/**/*js'
          ]
        }]
      },
      css: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>',
          dest: '<%= folders.tmp %>',
          src: [
            'styles/{,*/}*css'
          ]
        }]
      },
      assets: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>',
          dest: '<%= folders.dist %>',
          src: [
            'assets/{,*/}*.*'
          ]
        }]
      }
    },
    concurrent: {
      server: [
        'stylus'
      ],
      test: [
        'stylus'
      ],
      dist: [
        'stylus',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      build: ['<%= folders.app %>/scripts/**/*js']
    },
    rename: {
      secure: {
        src: '<%= folders.dist %>/donate.html',
        dest: '<%= folders.dist %>/secure/donate.html'
      }
    }
  });

  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'jade',
      'concurrent:server',
      'connect:server',
      'watch'
    ]);
  });

  grunt.registerTask('php-server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'php:dist']);
    }

    grunt.task.run([
      'clean:server',
      'jade',
      'concurrent:server',
      'php:server'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jade',
    'copy:js',
    'copy:css',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'copy:assets',
    'rev',
    'usemin',
    'rename:secure'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
