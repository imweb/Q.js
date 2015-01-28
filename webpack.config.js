var webpack = require('webpack');
var banner =
  '/*!\n' +
  ' * Q.js v' + require('./package').version + '\n' +
  ' * Inspired from vue.js\n' +
  ' * (c) ' + new Date().getFullYear() + ' Daniel Yang\n' +
  ' * Released under the MIT License.\n' +
  ' */\n' +
  '\n' +
  '/**\n' +
  ' * from: http://kangax.github.io/compat-table/es5\n' +
  ' * We can find almost all es5 features have been supported after IE9,\n' +
  ' * so we suggest under IE8 just use:\n' +
  ' * https://github.com/es-shims/es5-shim\n' +
  ' */\n'

module.exports = {
  output: {
    filename: 'Q.js',
    library: 'Q',
    libraryTarget: 'umd'
  },
  externals: {
    'jquery': {
      root: 'jQuery',
      amd: 'jquery',
      commonjs2: 'jquery',
      commonjs: 'jquery'
    }
  },
  plugins: [
    new webpack.BannerPlugin(banner, { raw: true })
  ]
};
