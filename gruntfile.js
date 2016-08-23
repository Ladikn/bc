/*global module */
module.exports = function (grunt) {
	grunt.initConfig({

		nodemon: {
			all: {
				script: 'server.js',
				options: {
					watchedExtensions: ['js', 'html', 'css']
				}
			}
		}
	

	});

	// Add all plugins that your project needs here
	grunt.loadNpmTasks('grunt-nodemon');

	// this would be run by typing "grunt test" on the command line
	// the array should contains the names of the tasks to run
	grunt.registerTask('test', []);

	// define the default task that can be run just by typing "grunt" on the command line
	// the array should contains the names of the tasks to run
	grunt.registerTask('default', ['nodemon']);
};