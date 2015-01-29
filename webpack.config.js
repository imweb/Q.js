var webpack = require('webpack');
var banner =
  '/*!\n' +
  ' * Q.js v' + require('./package').version + '\n' +
  ' * Inspired from vue.js\n' +
  ' * (c) ' + new Date().getFullYear() + ' Daniel Yang\n' +
  ' * Released under the MIT License.\n' +
  ' */\n';
var jqueryPrompt =
  '/**\n' +
  ' * from: http://kangax.github.io/compat-table/es5\n' +
  ' * We can find almost all es5 features have been supported after IE9,\n' +
  ' * so we suggest under IE8 just use:\n' +
  ' * https://github.com/es-shims/es5-shim\n' +
  ' */\n';
var zeptoPrompt =
  '/**\n' +
  ' * Depend on zepto & support mobile browser\n' +
  ' */\n';
var nativePrompt =
  '/**\n' +
  ' * Just support modern browser\n' +
  ' */\n';

module.exports = {
  jquery: {
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
      new webpack.BannerPlugin([banner, jqueryPrompt].join('\n'), { raw: true })
    ]
  },
  zepto: {
    output: {
      filename: 'Q.zepto.js',
      library: 'Q',
      libraryTarget: 'umd'
    },
    externals : {
      'zepto': {
        root: 'Zepto',
        amd: 'zepto',
        commonjs2: 'zepto',
        commonjs: 'zepto'
      }
    },
    plugins: [
      new webpack.BannerPlugin([banner, zeptoPrompt].join('\n'), { raw: true }),
      new webpack.ProvidePlugin({
          Zepto: 'zepto',
      })
    ]
  },
  'native': {
    output: {
      filename: 'Q.native.js',
      library: 'Q',
      libraryTarget: 'umd'
    },
    plugins: [
      new webpack.BannerPlugin([banner, nativePrompt].join('\n'), { raw: true })
    ]
  }
};
