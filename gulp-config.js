module.exports ={
  srcBasePath:  'src',
  targetBasePath: 'dist',

  css: {
    srcPath: 'assets/css',
    targetPath: 'assets/css',
    include: [
      'node_modules/normalize.css/normalize.css'
    ],
    exclude: []
  },

  sass: {
    srcPath: 'assets/css',
    targetPath: 'assets/css',
    include: [],
    exclude: []
  },

  js: {
    srcPath: 'assets/js',
    targetPath: 'assets/js',
    include: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/underscore/underscore-min.js'
    ],
    exclude: []
  },

  image: {
    srcPath: 'assets/images',
    targetPath: 'assets/images',
    include: [],
    exclude: []
  },

  html: {
    srcPath: '.',
    targetPath: '.',
    include: [],
    exclude: []
  }
};
