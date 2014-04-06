// Generated on 2014-03-31 using generator-webapp 0.4.8
'use strict';

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: {
      // Configurable paths
      app: 'app',
      dist: 'dist',
      tmp:'.tmp',
    },

    concat: {
      tests: {
        src: ['<%=config.app%>/tests/**/*.js'],
        dest: '<%=config.tmp%>/concat/scripts/tests/tests.js',
      }
    },

    qunit: {
      all: ['<%=config.app%>/tests/**/*.html']
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= config.app %>/scripts/**/*.js'],
        tasks: ['jshint']
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/styles/**/*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
              '.tmp',
              '<%= config.dist %>/*',
              '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
          '!Gruntfile.js',
          '<%= config.app %>/scripts/{,*/}*.js',
          '!<%= config.app %>/scripts/vendor/*',
          'test/spec/{,*/}*.js'
      ]
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
              '<%= config.dist %>/scripts/**/*.js',
              '<%= config.dist %>/styles/**/*.css',
              '<%= config.dist %>/images/**/*.*',
              '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/**/*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'images/{,*/}*.webp',
              '{,*/}*.html',
              'styles/fonts/{,*/}*.*'
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>',
        dest: '.tmp/styles/',
        src: ['styles/**/*.css']
      },
      fonts: {
        expand: true,
        flatten: true,
        dot: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist%>/styles/fonts/',
        src: ['../bower_components/font-awesome/fonts/*.*']
      },
      test: {
        expand: true,
        flatten: true,
        dot: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist%>/styles/fonts/',
        src: ['../bower_components/font-awesome/fonts/*.*']
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: ['copy:styles', 'copy:fonts'],
      test: ['copy:styles', 'copy:fonts'],
      dist: ['copy:styles', 'copy:fonts', 'imagemin', 'svgmin']
    }
  });

  grunt.registerTask('test', ['clean:dist', 'useminPrepare', 'concat','concat:tests', 'qunit']);

  grunt.registerTask('build', [
      'newer:jshint',
      'clean:dist',
      'useminPrepare',
      'concurrent:dist',
      'autoprefixer',
      'concat',
      'concat:tests', 
      'qunit',
      'cssmin',
      'uglify',
      'copy:dist',
      'rev',
      'usemin',
      'htmlmin'
  ]);

  grunt.registerTask('default', ['newer:jshint','test']);
};
