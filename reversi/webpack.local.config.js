const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const SpritesmithPlugin = require('webpack-spritesmith');
const BundleTracker = require('webpack-bundle-tracker');
const path = require('path');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

const nodeModulesDir = path.resolve(__dirname, 'node_modules');

baseConfig[0].mode = 'development';
baseConfig[1].mode = 'development';

baseConfig[1].devtool = 'cheap-module-source-map';

baseConfig[1].entry = [
  // Enables websocket connection (needs url and port)
  'webpack-dev-server/client?http://localhost:3000',
  // Perform HMR in the browser.
  // Unlike dev-server, which is by default, only-dev-server doesn't reload the
  // browser upon syntax errors and keeps state of react.
  'webpack/hot/only-dev-server',
  'whatwg-fetch',
  'babel-polyfill',
  // Entry point of our app
  './assets/js/index'
];

baseConfig[0].output.publicPath = 'http://localhost:3000/assets/bundles/';
baseConfig[1].output = {
  path: path.resolve('./assets/bundles/'),
  publicPath: 'http://localhost:3000/assets/bundles/',
  filename: '[name].js'
};

baseConfig[1].module.rules.push(
  {
    test: /\.jsx?$/,
    exclude: [nodeModulesDir],
    loader: require.resolve('babel-loader')
  },
  {
    test: /\.(woff(2)?|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=100000'
  }
);

baseConfig[1].resolve.alias = {
  'react-dom': '@hot-loader/react-dom'
};

baseConfig[1].plugins = [
  // Generate hot update chunks
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error
  new ErrorOverlayPlugin(), // show stack trace
  new SpritesmithPlugin({
    src: {
      cwd: path.resolve(__dirname, 'assets/images/'),
      glob: '*.png'
    },
    target: {
      image: path.resolve(
        __dirname,
        'assets/images/spritesmith-generated/sprite.png'
      ),
      css: path.resolve(__dirname, 'assets/sass/vendor/spritesmith.scss')
    },
    retina: '@2x'
  }),
  new BundleTracker({
    filename: './webpack-stats.json'
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: __dirname,
      postcss: [autoprefixer]
    }
  }),
  new webpack.ProvidePlugin({
    React: 'react',
    ReactDOM: 'react-dom',
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Tether: 'tether',
    'window.Tether': 'tether',
    Popper: ['popper.js', 'default'],
    Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
    Button: 'exports-loader?Button!bootstrap/js/dist/button',
    Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
    Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
    Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
    Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
    Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
    Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
    Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
    Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
    Util: 'exports-loader?Util!bootstrap/js/dist/util'
  })
];

module.exports = baseConfig;
