module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    coffee: {
      compile: {
        options: {
          sourceMap: true
        },
        files: {
          'js/codewave.js': [
            'js/src/codewave.coffee',
            'js/src/util.coffee',
            'js/src/storage.coffee',
            'js/src/editor.coffee',
            'js/src/text_parser.coffee',
            'js/src/edit_cmd_prop.coffee',
            'js/src/text_area_editor.coffee',
            'js/src/*.coffee',
            '!js/src/init.coffee',
            'js/src/cmds/*.coffee',
            'js/src/init.coffee'
          ] // concat then compile into single file
        }
      }
    },
    sass: {
      dist: {
        files: {
          'css/app.css': 'sass/app.sass'
        }
      }
    },
    uglify: {
        files: { 
            src: ['js/codewave.js'],  // source files mask
            dest: 'js/',    // destination folder
            expand: true,    // allow dynamic building
            flatten: true,   // remove all unnecessary nesting
            ext: '.min.js'   // replace .js to .min.js
        }
    },
    watch: {
        options: {
          atBegin: true,
          livereload: true
        },
        // js:  { files: 'js/*.js', tasks: [ 'uglify' ] },
        sass:  { files: 'sass/*.sass', tasks: [ 'sass' ] },
        coffee:  { files: 'js/src/*.coffee', tasks: [ 'coffee','uglify' ] },
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-coffee');
grunt.loadNpmTasks('grunt-contrib-sass');

// register at least this one task
grunt.registerTask('default', [ 'coffee', 'uglify', 'sass' ]);


};