const path = require('path');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'node',

  entry: [
    'babel-polyfill',
    './webclient/src/index.jsx',
  ],

  output: {
    path: path.join(__dirname, 'webclient/dist/'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        // Build JS and JSX with Babel
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'webclient/src')],
        query: { presets: ['env', 'react', 'stage-2'] },
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        loader: 'babel-loader',
      },
      {
        // Compile SCSS into CSS and allow requiring from JS files
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'webclient/src')],
        use: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', options: {/* outputStyle: 'compressed' */} },
        ],
      },
      {
        // Compile SCSS into CSS and allow requiring from JS files
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules/react-router-modal/css')],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: './webclient/src/*.html', flatten: true },
    ]),
  ],
};

/*
  // Have webpack-serve return index.html for any path
  module.exports.serve = {
    content: [__dirname],
    add: (app) => {
      const historyOptions = {
        index: '/index.html',
      };
      app.use(convert(history(historyOptions)));
    },
  };\
*/
