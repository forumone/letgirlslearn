/*global module:false*/
'use strict';

var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    pkgName: '<%= pkg.name %>',
    siteDir: './site/',
    imgSrcDir: './src/img/',
    imgBuildDir: './site/img/',
    jsBuildDir: './site/js/',
    jsSrcDir: './src/js/',
    cssBuildDir: './site/css/',
    cssSrcDir: './src/css/',
    // Task configuration.
    clean: {
      js: '<%= jsBuildDir %>**/*',
      css: '<%= cssBuildDir %>**/*',
      img: '<%= imgBuildDir %>**/*'
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 4,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: '<%= imgSrcDir %>',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= imgBuildDir %>'
        }]
      }
    },
    env: {
      bin: {
        concat: {
          PATH : {
            'value': 'node_modules/.bin',
            'delimiter': ':'
          }
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        options: {
          includePaths: require('node-bourbon').includePaths.concat(
            require('node-neat').includePaths)
        },
        files: [
          { '<%= cssBuildDir %><%= pkgName %>.css': '<%= cssSrcDir %><%= pkgName %>.scss'}
        ]
      }
    },
    browserify: {
      letgirlslearn: {
        options: {
          exclude: '<%= jsSrcDir %>test/**/*.js',
          browserifyOptions: {
             debug: true
          }
        },
        dest: '<%= jsBuildDir %><%= pkgName %>.js',
        src: '<%= jsSrcDir %><%= pkgName %>.js'
      },
      withWatch: {
        options: {
          exclude: '<%= jsSrcDir %>test/',
          browserifyOptions: {
             debug: true
          },
          watch: true
        },
        dest: '<%= jsBuildDir %><%= pkgName %>.js',
        src: '<%= jsSrcDir %><%= pkgName %>.js'
      }
    },
    exorcise: {
      donation: {
        options: {},
        files: {
          '<%= browserify.letgirlslearn.dest %>.map': [
            '<%= browserify.letgirlslearn.dest %>'],
        }
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        sourceMap: true,
        sourceMapIn: '<%= browserify.letgirlslearn.dest %>.map',
        sourceMapIncludeSources : true
      },
      dist: {
        src: '<%= browserify.letgirlslearn.dest %>',
        dest: '<%= jsBuildDir %><%= pkgName %>.min.js'
      }
    },
    jshint: {
      all: ['<%= jsSrcDir %>**/*.js'],
      options: {
        jshintrc: './.jshintrc'
      }
    },
    exec: {
      cssmin: {
        cmd: 'cleancss -o <%= cssBuildDir %><%= pkgName %>.min.css --source-map '+
          '<%= cssBuildDir %><%= pkgName %>.css.map <%= cssBuildDir %><%= pkgName %>.css'
      },
      jekyllBuild: {
        cmd: 'jekyll build'
      }
    },
    copy: {
      img: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['./src/img/*'],
            dest: '<%= siteDir %>img/',
            filter: 'isFile'
          }
        ]
      }
    },
    connect: {
      server: {
        options: {
          port:  8001,
          hostname: '127.0.0.1',
          base: 'rendered'
        }
      }
    },
    watch: {
      js: {
        files: '<%= jsSrcDir %>**/*.js',
        tasks: ['jshint']
      },
      css: {
        files: ['<%= cssSrcDir %>**/*.scss', '!<%= cssSrcDir %>bourbon',
                                    '!<%= cssSrcDir %>neat'],
        tasks: ['build-css']
      },
      img: {
        files: '<%= imgBuildDir %>**/*',
        tasks: ['build-img']
      },
      jekyll: {
        files: ['site/*', 'site/**'],
        tasks: ['exec:jekyllBuild']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-exorcise');
  grunt.loadNpmTasks('grunt-testling');

  // Default task.
  grunt.registerTask('default', ['build-css']);
  grunt.registerTask('build-img', [
    'clean:img',
    'imagemin'
  ]);
  grunt.registerTask('build-js', [
    'jshint',
    'clean:js',
    'browserify:letgirlslearn',
    'exorcise',
    'uglify'
  ]);
  grunt.registerTask('build-css', [
    'env:bin',
    'clean:css',
    'sass',
    'exec:cssmin'
  ]);
  grunt.registerTask('test-js-unit', ['env:bin', 'jshint', 'testling']);
  grunt.registerTask('build', ['build-css', 'build-img', 'build-js', 'exec:jekyllBuild']);
  grunt.registerTask('build-watch', [
    'browserify:withWatch',
    'connect:server',
    'watch'
  ]);
};
