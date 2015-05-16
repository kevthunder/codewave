module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['mocha', 'chai'],
    files: [
      'js/codewave.js',
      'test/js/*.js',
      'js/vendors/emmet-min.js',
      'test/spec/*.js'
    ],
    browsers: ['PhantomJS'],

    reporters: ['progress', 'coverage'],
    preprocessors: { 'js/codewave.js': ['coverage'] },

    singleRun: true
  });
};