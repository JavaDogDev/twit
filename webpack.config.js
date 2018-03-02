const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: [
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
        loader: 'babel-loader',
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'webclient/src')],
        query: { presets: ['env', 'react', 'stage-2'] },
        resolve: {
          extensions: ['.js', '.jsx'],
        },
      },
      {
        // Compile SCSS into CSS and allow requiring from JS files
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'webclient/src')],
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  // Mark these as external (not to be included in the bundle,
  // because they're included through script tags linking to CDNs)
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: './webclient/src/*.html', flatten: true },
    ]),
  ],
};
