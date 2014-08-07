'use strict';
 
module.exports = function(grunt) {
 
  // configure grunt
  grunt.initConfig({
 
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['app/client/js/*.js',
              'app/client/js/**/*.js',
              'app/server/*.js',
              'app/server/**/*.js']
    }
  });
 
  // Load plug-ins
  // grunt.loadNpmTasks('grunt-contrib-whatever');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // define tasks
  grunt.registerTask('default', [
    // No tasks, yet
    'jshint'
  ]);
};