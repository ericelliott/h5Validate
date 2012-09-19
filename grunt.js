/*global module*/
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      all: ['./grunt.js', './dist/*.js', './test/test.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        nonew: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        eqnull: true,
        browser: true,
        strict: true,
        boss: false
      }
    },
    qunit: {
      browser: ['test/index.html']
    }
  });
  grunt.registerTask('default', 'lint qunit');
};
