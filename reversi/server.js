// Webpack dev server
import openBrowser from 'react-dev-utils/openBrowser';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.local.config';

new WebpackDevServer(webpack(config), {
  publicPath: config[1].output.publicPath,
  hot: true,
  inline: true,
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  overlay: true
}).listen(3000, '0.0.0.0', err => {
  if (err) {
    return console.log(err);
  }
  console.log('Listening at 0.0.0.0:3000');
  if (openBrowser('http://127.0.0.1:8000')) {
    console.log('Opening the browser tab...');
  }
});
