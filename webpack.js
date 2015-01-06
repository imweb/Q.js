var webpack = require('webpack')
var banner =
  '/**\n' +
  ' * Q.js v' + require('./package').version + '\n' +
  ' * Inspired from vue.js\n' +
  ' * (c) ' + new Date().getFullYear() + ' Daniel Yang\n' +
  ' * Released under the MIT License.\n' +
  ' * from: http://kangax.github.io/compat-table/es5\n' +
  ' * We can find almost all es5 features have been supported after IE9,\n' +
  ' * so we suggest under IE8 just use:\n' +
  ' * https://github.com/es-shims/es5-shim\n' +
  ' */\n'

webpack({
  entry: './src/Q',
  output: {
    path: './dist',
    filename: 'Q.js',
    library: 'Q',
    libraryTarget: 'umd'
  },
  externals: { jquery: "jquery" },
  plugins: [
    new webpack.BannerPlugin(banner, { raw: true }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery'
    })
  ]
}, function (err, stats) {
  if (err) return console.error(err);
  console.log('done!');
});
