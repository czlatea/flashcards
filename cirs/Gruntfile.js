'use strict';

var fs = require('fs');
var path = require('path');
var md5 = require('MD5');
var _ = require('lodash');
var webRoot = 'Frontend.Web/CIRS.Web/';
var templatesPath = webRoot + 'templates/';
var jsPath = webRoot + 'js/';
var clientRoot = 'Backend/Business/BusinessLogic/ValidationRules/Client/';
module.exports = function(grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    emberTemplates: {
      compile: {
        options: {
          templateBasePath: new RegExp(templatesPath),
        },
        files: {
          'Frontend.Web/CIRS.Web/Scripts/templates.js': [templatesPath + '**/*.hbs']
        }
      }
    },
    browserify: {
      dist: {
        options: {
          debug: true
        },
        files: {
          'Frontend.Web/CIRS.Web/Scripts/app.js': [jsPath + 'index.js']
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/lodash/dist/lodash.js',
          'bower_components/bootstrap/js/affix.js',
          'bower_components/bootstrap/js/alert.js',
          'bower_components/bootstrap/js/button.js',
          'bower_components/bootstrap/js/carousel.js',
          'bower_components/bootstrap/js/collapse.js',
          'bower_components/bootstrap/js/dropdown.js',
          'bower_components/bootstrap/js/modal.js',
          'bower_components/bootstrap/js/tooltip.js',
          'bower_components/bootstrap/js/popover.js',
          'bower_components/bootstrap/js/scrollspy.js',
          'bower_components/bootstrap/js/tab.js',
          'bower_components/bootstrap/js/transition.js',
          'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
          'bower_components/bootstrap-timepicker/js/bootstrap-timepicker.js',
          'bower_components/chosen/chosen.jquery.js',
          'bower_components/typeahead.js/dist/typeahead.js',
          'bower_components/moment/moment.js',
          'bower_components/toastr/toastr.js',
          'bower_components/uri.js/src/URI.js',
          'bower_components/uri.js/src/URI.fragmentQuery.js',
          'bower_components/uri.js/src/URI.fragmentURI.js',
          'bower_components/keymaster/keymaster.js',
          'bower_components/handlebars/handlebars.js',
          //'bower_components/ember/ember.js', // release build
          webRoot + 'vendor/ember/ember.js', // canary build
          'bower_components/ember-data/ember-data.js',
          'bower_components/validator.js/dist/validator.min.js',
        ],
        dest: webRoot + 'Scripts/vendor.js',
      },
    },
    less: {
      dist: {
        files: {
          'Frontend.Web/CIRS.Web/css/vendor.css': [webRoot + 'css/vendor.less']
        }
      }
    },
    stylus: {
      compile: {
        options: {
          paths: [webRoot + 'css'],
          'include css': true,
          //urlfunc: 'embedurl',
          // use: [
          //   require('fluidity') // use stylus plugin at compile time
          // ],
          // import: [      //  @import 'foo', 'bar/moo', etc. into every .styl file
          //   'foo',       //  that is compiled. These might be findable based on values you gave
          //   'bar/moo'    //  to `paths`, or a plugin you added under `use`
          // ]
        },
        files: {
          'Frontend.Web/CIRS.Web/Content/app.css': [webRoot + 'css/app.styl']
        }
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          flatten: true,
          src: ['bower_components/font-awesome/fonts/*'], // include all font files
          dest: webRoot + 'Content/fonts/',
          filter: 'isFile'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      files: ['*.js', webRoot + 'js/**/*.js', webRoot + '*.js', clientRoot + '**/*.js']
    },
    exec: {
      test: {
        cmd: 'packages\\phantomjs.exe.1.8.1\\tools\\phantomjs\\phantomjs.exe test-runner.js ' +
          webRoot
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      css: {
        files: [webRoot + 'css/**/*.less', webRoot + 'css/**/*.styl'],
        tasks: ['less', 'stylus', 'manifest']
      },
      templates: {
        files: [webRoot + 'templates/**/*.hbs'],
        tasks: ['emberTemplates', 'manifest', 'exec:test']
      },
      browserify: {
        files: ['*.js', webRoot + 'js/**/*.js', webRoot + '*.js',
          'Backend/Business/BusinessLogic/ValidationRules/Client/**/*.js'
        ],
        tasks: ['jshint', 'compileJs', 'manifest', 'exec:test']
      }
    },
    uglify: {
      publicjs: {
        options: {
          preserveComments: false,
          report: 'min' //'gzip'
        },
        files: {
          'Frontend.Web/CIRS.Web/Scripts/app.js': [
            'Frontend.Web/CIRS.Web/Scripts/app.js'
          ],
          'Frontend.Web/CIRS.Web/Scripts/templates.js': [
            'Frontend.Web/CIRS.Web/Scripts/templates.js'
          ],
          'Frontend.Web/CIRS.Web/Scripts/vendor.js': [
            'Frontend.Web/CIRS.Web/Scripts/vendor.js'
          ]
        }
      }
    },
    cssmin: {
      publiccss: {
        options: {
          keepSpecialComments: 0,
          report: 'min' //'gzip'
        },
        files: {
          'Frontend.Web/CIRS.Web/Content/app.css': [
            'Frontend.Web/CIRS.Web/Content/app.css'
          ]
        }
      }
    }
  });

  grunt.registerTask('stripBom', 'Strip BOMs from text files', function() {
    var files = [webRoot + 'Scripts/app.js'];
    files.forEach(function(file) {
      var content = fs.readFileSync(path.join(__dirname, file), {
        encoding: 'utf8'
      });
      content = content.replace(/\uFEFF/g, ''); // fix visual studio inserted bom
      fs.writeFileSync(path.join(__dirname, file), content);
    });
  });

  grunt.registerTask('generateIndexJs', 'Generates an index.js for browserify', function() {
    var done = this.async();

    var addFile = function(stream, file) {
      if (file.match(/\.js$/)) {
        stream.write('require("./' + file + '");\n');
      }
    };

    var addFolder = function(stream, folder, firstFiles, excludeFiles) {
      stream.write('\n// Include all ' + (folder || 'root files') + '\n');

      if (folder) {
        folder = folder + '/';
      }
      firstFiles = firstFiles || [];
      excludeFiles = excludeFiles || [];


      // output first files
      firstFiles.forEach(function(file) {
        addFile(stream, folder + file);
      });

      // output other files
      var dir = path.join(__dirname, jsPath + folder);
      _.each(_.difference(fs.readdirSync(dir),
        _.union(firstFiles, excludeFiles)), function(file) {
        addFile(stream, folder + file);
      });
    };

    var stream = fs.createWriteStream(path.join(__dirname, jsPath + 'index.js'), {
      encoding: 'utf8'
    });
    stream.once('open', function(fd) {
      stream.write('/* jshint maxlen: 300 */\n');
      stream.write('// Auto-generated index of all js files\n');
      addFolder(stream, '', ['app.js', 'config.js'], ['index.js']);
      addFolder(stream, 'helpers');
      addFolder(stream, 'data-access');
      addFolder(stream, 'models', ['application-model.js', 'CIRS.js', 'SWP.js']);
      addFolder(stream, 'components', ['focusable', 'input-with-validation.js']);
      addFolder(stream, 'views');
      addFolder(stream, 'controllers');
      addFolder(stream, 'controllers/report');
      addFolder(stream, 'controllers/SWP');
      addFolder(stream, '../../../' + clientRoot, ['QC.js'], ['underscore-min.js',
        'validator.min.js', 'moment.min.js',
        'QCClientConfig.js'
      ]);
      addFolder(stream, '../../../' + clientRoot + 'Module01');
      addFolder(stream, '../../../' + clientRoot + 'Module02', ['module02Helper.js']);
      addFolder(stream, '../../../' + clientRoot + 'Module03', ['module03Helper.js']);
      addFolder(stream, '../../../' + clientRoot + 'Module05');
      addFolder(stream, '../../../' + clientRoot + 'Module06', ['module06Helper.js']);
      addFolder(stream, '../../../' + clientRoot + 'Module07', ['module07Helper.js']);
      addFolder(stream, '../../../' + clientRoot + 'Module10', ['module10Helper.js']);
      addFile(stream, '../../../' + clientRoot + 'QCClientConfig.js'); //it should be the last
      stream.end(done);
    });
  });

  grunt.registerTask('manifest', 'Generate the app cache manifest.', function() {
    var done = this.async();

    // hash the app
    var cssHash = md5(fs.readFileSync(path.join(__dirname, webRoot + 'Content/app.css')));
    var printHash = md5(fs.readFileSync(path.join(__dirname, webRoot + 'Content/print.css')));
    var vendorHash = md5(fs.readFileSync(path.join(__dirname, webRoot + 'Scripts/vendor.js')));
    var templateHash = md5(fs.readFileSync(path.join(__dirname, webRoot + 'Scripts/templates.js')));
    var appHash = md5(fs.readFileSync(path.join(__dirname, webRoot + 'Scripts/app.js')));

    // output the manifest
    var stream = fs.createWriteStream(path.join(__dirname, webRoot + 'manifest.appcache'), {
      encoding: 'utf8'
    });
    stream.once('open', function(fd) {
      stream.write('CACHE MANIFEST\n');
      stream.write('\n');
      stream.write('CACHE:\n');
      stream.write('\n');
      stream.write('# Policy files\n');
      stream.write('/crossdomain.xml\n');
      stream.write('\n');
      stream.write('# Single Page\n');
      stream.write('\n');
      stream.write('/\n');
      stream.write('\n');
      stream.write('# Style\n');
      stream.write('\n');
      stream.write('# app.css hash:   ' + cssHash + '\n');
      stream.write('/Content/app.css\n');
      stream.write('# print.css hash: ' + printHash + '\n');
      stream.write('/Content/print.css\n');
      stream.write('\n');
      stream.write('# Logic\n');
      stream.write('\n');
      stream.write('# vendor.js hash: ' + vendorHash + '\n');
      stream.write('/Scripts/vendor.js\n');
      stream.write('# templates.js hash:    ' + templateHash + '\n');
      stream.write('/Scripts/templates.js\n');
      stream.write('# app.js hash:    ' + appHash + '\n');
      stream.write('/Scripts/app.js\n');
      stream.write('\n');
      stream.write('# Images\n');
      stream.write('\n');
      fs.readdirSync(path.join(__dirname, webRoot + 'Content/Images')).forEach(function(file) {
        stream.write('/Content/Images/' + file + '\n');
      });
      stream.write('\n');
      stream.write('# Fonts\n');
      stream.write('\n');
      stream.write('/Content/Fonts/fontawesome-webfont.woff\n');
      stream.write('\n');
      stream.write('NETWORK:\n');
      stream.write('\n');
      stream.write('/api\n');
      stream.write('/Services\n');
      stream.write('/ExternalServices\n');
      stream.write('https://ciosp.cirs-local.dev.sg.info:444/\n');
      stream.write('\n');
      stream.write('FALLBACK:\n');
      stream.write('\n');
      stream.write('# Support Push State\n');
      stream.write('/ /\n');
      stream.end();

      done();
    });
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('compileJs', ['generateIndexJs', 'browserify', 'stripBom']);
  grunt.registerTask('build', [
    'jshint', 'emberTemplates', 'less', 'stylus', 'compileJs',
    'concat', 'copy', 'manifest', 'exec:test'
  ]);
  grunt.registerTask('server', ['build', 'watch']);
  grunt.registerTask('production', [
    'build', 'uglify', 'cssmin'
  ]);
  grunt.registerTask('default', ['production']);
};
