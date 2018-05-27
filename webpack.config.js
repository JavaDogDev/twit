const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PRODUCTION = false;

module.exports = {
  mode: PRODUCTION ? 'production' : 'development',
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
          { loader: 'sass-loader', options: { outputStyle: PRODUCTION ? 'compressed' : null } },
        ],
      },
      {
        // Just for CSS bundled with particular libraries
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules/react-router-modal/css')],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: './webclient/src/*.html', flatten: true },
      { from: './webclient/src/img/*', to: 'img/', flatten: true },
    ]),
  ],

  // Disable stupid "oh no app > 244 KiB" warning
  performance: { hints: false },
};
