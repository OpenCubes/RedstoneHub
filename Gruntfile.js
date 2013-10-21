'use strict';
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({});
    grunt.initConfig({
        bower: {
            target: {
                rjsConfig: 'public/app/config/modules.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-requirejs');

    grunt.registerTask('default', ['bower']);
};